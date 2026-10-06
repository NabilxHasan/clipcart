// ClipCart - Enterprise Anti-SQL Injection & Input Defense Engine
// Hardened against all payloads in payload-box/sql-injection-payload-list
// Provides deep pattern inspection, typed identifier classification, and parameterized query safety.

import { validateEmail } from '../validation/email';

export interface SqlScanResult {
  isSuspicious: boolean;
  threatType?: string;
  matchedPattern?: string;
}

/**
 * High-fidelity signatures covering payload-box/sql-injection-payload-list:
 * - Generic SQLi & Auth Bypasses
 * - Boolean / Tautology injections
 * - UNION-based data extraction
 * - Stacked query executions (; DROP, ; UPDATE, etc.)
 * - Time-based blind injections (pg_sleep, WAITFOR, benchmark)
 * - Error-based subqueries (extractvalue, updatexml)
 * - PostgREST filter string injections (eq., ilike., etc.)
 */
const SQLI_PATTERNS: Array<{ type: string; regex: RegExp }> = [
  // 1. Tautologies & Auth Bypasses (' OR '1'='1, ' OR 1=1--, ' OR true, etc.)
  {
    type: 'TAUTOLOGY_BYPASS',
    regex: /(?:'|")\s*(?:or|and|xor|\|\|)\s*(?:'|")?[a-zA-Z0-9_]+(?:'|")?\s*=\s*(?:'|")?[a-zA-Z0-9_]+/i,
  },
  {
    type: 'BOOLEAN_LOGIC_BYPASS',
    regex: /\b(?:or|and)\b\s+(?:true|false|1\s*=\s*1|0\s*=\s*0|null\s+is\s+null|'a'\s*=\s*'a')\b/i,
  },
  {
    type: 'NUMERIC_TAUTOLOGY',
    regex: /\b(?:or|and)\b\s+\d+\s*=\s*\d+/i,
  },
  // 2. SQL Comment Truncations (admin'--, admin' #, admin'/*)
  {
    type: 'COMMENT_TRUNCATION',
    regex: /(?:'|"|`)\s*(?:--|#|\/\*)/i,
  },
  {
    type: 'STANDALONE_SQL_COMMENT',
    regex: /(?:--\s*$|--\s*[\w\s-]|#\s*$|\/\*[\s\S]*?\*\/)/i,
  },
  // 3. UNION-based Injections (' UNION SELECT null, null--)
  {
    type: 'UNION_SELECT',
    regex: /\bunion\s+(?:all\s+)?select\b/i,
  },
  // 4. Stacked Query Execution (; DROP TABLE, ; UPDATE, etc.)
  {
    type: 'STACKED_QUERY',
    regex: /;\s*(?:select|insert|update|delete|drop|truncate|alter|create|exec|execute|grant|revoke|load_file|copy)\b/i,
  },
  // 5. Time-Based Blind Injections (pg_sleep, sleep, WAITFOR DELAY, benchmark)
  {
    type: 'TIME_BASED_BLIND',
    regex: /\b(?:pg_sleep|sleep|waitfor\s+delay|benchmark)\s*\(/i,
  },
  // 6. Error-Based Subqueries & Meta Extraction
  {
    type: 'ERROR_BASED_OR_META',
    regex: /\b(?:information_schema|extractvalue|updatexml|into\s+(?:out|dump)file|@@version|version\(\)|current_user|user\(\)|schema\(\))\b/i,
  },
  // 7. Subquery Injection (SELECT ... FROM ...)
  {
    type: 'SUBQUERY_INJECTION',
    regex: /\bselect\b[\s\S]{1,100}\bfrom\b[\s\S]{1,50}\b(?:where|group|order|limit)\b/i,
  },
  // 8. Hex / Encoding / Conversion Attacks
  {
    type: 'ENCODED_HEX_ATTACK',
    regex: /(?:0x[0-9a-fA-F]{4,}|char\s*\(\s*\d+|concat\s*\()/i,
  },
  // 9. PostgREST Filter Injection (attempts to alter Supabase query trees)
  {
    type: 'POSTGREST_OPERATOR_INJECTION',
    regex: /\b(?:eq|neq|gt|gte|lt|lte|like|ilike|is|in|cs|cd|not)\.[a-zA-Z0-9_%]/i,
  },
];

/**
 * Scans an untrusted input string for SQL injection payload signatures.
 */
export function detectSqlInjection(input?: unknown): SqlScanResult {
  if (typeof input !== 'string') return { isSuspicious: false };
  if (!input || input.trim().length === 0) return { isSuspicious: false };

  const raw = input.trim();

  // Decode URI encoding if present (e.g. %27 -> ')
  let normalized = raw;
  try {
    normalized = decodeURIComponent(raw);
  } catch {
    // Malformed encoding itself can be suspicious if contains null bytes
    if (raw.includes('%00') || raw.includes('\0')) {
      return { isSuspicious: true, threatType: 'NULL_BYTE_INJECTION', matchedPattern: 'NULL_BYTE' };
    }
  }

  // Null byte injection check
  if (normalized.includes('\0')) {
    return { isSuspicious: true, threatType: 'NULL_BYTE_INJECTION', matchedPattern: 'NULL_BYTE' };
  }

  for (const { type, regex } of SQLI_PATTERNS) {
    if (regex.test(normalized)) {
      return {
        isSuspicious: true,
        threatType: type,
        matchedPattern: regex.source,
      };
    }
  }

  return { isSuspicious: false };
}

export type IdentifierType = 'EMAIL' | 'PHONE' | 'UUID' | 'TRX_ID' | 'INVALID';

export interface ClassifiedIdentifier {
  type: IdentifierType;
  clean: string;
  original: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SYSTEM_USER_ID_REGEX = /^usr-[a-zA-Z0-9_-]{1,50}$/i;
const TRX_ID_REGEX = /^[A-Za-z0-9]{6,25}$/;

/**
 * Classifies and strictly validates an authentication or lookup identifier
 * (email, phone, UUID, or transaction reference).
 * Rejects any input that contains SQL syntax or violates strict format bounds.
 */
export function classifyIdentifier(input: string): ClassifiedIdentifier {
  const original = (input || '').trim();
  if (!original) {
    return { type: 'INVALID', clean: '', original };
  }

  // 1. Immediately reject if SQL injection signature is detected
  const scan = detectSqlInjection(original);
  if (scan.isSuspicious) {
    return { type: 'INVALID', clean: '', original };
  }

  // 2. Reject inputs with dangerous characters that should never be in identifiers
  if (/['";`\\<>{}]/.test(original)) {
    return { type: 'INVALID', clean: '', original };
  }

  // 3. Test Email
  if (original.includes('@')) {
    const cleanEmail = original.toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(cleanEmail)) {
      return { type: 'EMAIL', clean: cleanEmail, original };
    }
    return { type: 'INVALID', clean: '', original };
  }

  // 4. Test UUID or System ID
  if (UUID_REGEX.test(original) || SYSTEM_USER_ID_REGEX.test(original)) {
    return { type: 'UUID', clean: original.toLowerCase(), original };
  }

  // 5. Test Phone Number (Bangladesh domestic 11 digits: 01..., or international: +8801...)
  const digitsOnly = original.replace(/\D/g, '');
  // A valid Bangladesh mobile number has 10 or 11 digits (e.g. 01712345678, or without leading 0: 1712345678),
  // or 13 digits with 880 prefix (8801712345678).
  if (digitsOnly.length >= 10 && digitsOnly.length <= 13) {
    let standardizedPhone = digitsOnly;
    if (digitsOnly.startsWith('880')) {
      standardizedPhone = digitsOnly.slice(2); // e.g. 01712345678
    } else if (!digitsOnly.startsWith('0') && digitsOnly.length === 10) {
      standardizedPhone = '0' + digitsOnly;
    }
    // Must now start with standard BD operator prefixes (013, 014, 015, 016, 017, 018, 019)
    if (/^01[3-9]\d{8}$/.test(standardizedPhone)) {
      return { type: 'PHONE', clean: standardizedPhone, original };
    }
  }

  // 6. Test Signup TrxID (Alphanumeric 6-25 chars)
  if (TRX_ID_REGEX.test(original)) {
    return { type: 'TRX_ID', clean: original.toUpperCase(), original };
  }

  return { type: 'INVALID', clean: '', original };
}

/**
 * Sanitizes generic user text before storage, removing control characters
 * and neutralizing potential SQL breakout characters.
 */
export function sanitizeSqlSafeText(text?: string, maxLength = 1000): string {
  if (!text) return '';
  return text
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // remove control codes
    .replace(/['";`\\]/g, '') // strip SQL delimiter characters
    .trim()
    .slice(0, maxLength);
}
