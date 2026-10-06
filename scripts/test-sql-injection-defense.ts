// ClipCart - Anti-SQL Injection Test Suite
// Verifies defense against payload-box/sql-injection-payload-list signatures
// Run with: npx tsx scripts/test-sql-injection-defense.ts or node after build

import assert from 'assert';
import { detectSqlInjection, classifyIdentifier, sanitizeSqlSafeText } from '../lib/security/anti-sqli';
import { serverAuthStore } from '../lib/auth/server-store';
import { ClipBDRepository } from '../lib/db/repository';

// Representative attack payloads directly from https://github.com/payload-box/sql-injection-payload-list
const SQLI_PAYLOADS = [
  // Generic Auth Bypass & Tautologies
  "' or 1=1--",
  "' or '1'='1",
  "' or 1=1#",
  "' or 1=1/*",
  "admin'--",
  "admin' #",
  "admin'/*",
  "' or 1=1 limit 1 -- -+",
  "') or ('1'='1--",
  "') or ('1'='1'--",
  "' or ''='",
  "1' or '1' = '1",
  "1' or 1=1 or '1'='1",
  '" or 1=1--',
  '" or "1"="1',
  "admin' or '1'='1",
  "admin' or '1'='1'--",
  "admin' or '1'='1'#",
  "admin' or '1'='1'/*",
  "' OR true --",
  "' OR false --",

  // UNION-Based Attacks
  "' UNION SELECT NULL, NULL, NULL--",
  "' UNION ALL SELECT 1, 'admin', 'hash'--",
  "1' UNION SELECT @@version--",
  "-1' UNION SELECT 1,2,3,4,5--",

  // Stacked Queries & Destruction
  "'; DROP TABLE users;--",
  "'; DELETE FROM profiles;--",
  "'; UPDATE profiles SET role='SUPER_ADMIN';--",
  "'; TRUNCATE TABLE clipper_profiles;--",
  "'; EXEC xp_cmdshell('dir');--",

  // Time-Based Blind Injection
  "' OR pg_sleep(5)--",
  "'; WAITFOR DELAY '0:0:5'--",
  "' OR (SELECT 1 FROM (SELECT(SLEEP(5)))a)--",
  "' OR benchmark(50000000,MD5(1))--",

  // Error-Based & Metadata Extraction
  "' AND 1=CONVERT(int, (SELECT @@version))--",
  "' AND EXTRACTVALUE(1, CONCAT(0x7e, @@version))--",
  "' AND UPDATEXML(1, CONCAT(0x7e, @@version), 1)--",
  "' AND (SELECT COUNT(*) FROM information_schema.tables)>0--",
  "' UNION SELECT table_name FROM information_schema.tables--",

  // PostgREST / Filter Operators
  "email.ilike.%,role.eq.SUPER_ADMIN",
  "id.neq.0",
  "status.in.(APPROVED,PENDING)",

  // Obfuscated & Encoded Injections
  "admin' /*!50000OR*/ 1=1 --",
  "0x27204f5220313d31202d2d",
  "admin' UNION SELECT CHAR(45,45,45)--",
];

const LEGITIMATE_INPUTS = [
  { input: "admin@clipcart.com", expectedType: "EMAIL" },
  { input: "nabilhasanjami@gmail.com", expectedType: "EMAIL" },
  { input: "01712345678", expectedType: "PHONE" },
  { input: "+8801337142248", expectedType: "PHONE" },
  { input: "8801712345678", expectedType: "PHONE" },
  { input: "usr-admin-01", expectedType: "UUID" },
  { input: "e2b3c4d5-6789-40ab-8cde-f123456789ab", expectedType: "UUID" },
  { input: "BK928410291", expectedType: "TRX_ID" },
  { input: "DIQ7WUNHRX", expectedType: "TRX_ID" },
];

async function runTestSuite() {
  console.log("=== ClipCart Anti-SQL Injection Test Suite ===");
  console.log(`Auditing ${SQLI_PAYLOADS.length} real-world SQL injection payloads from payload-box...\n`);

  let blockedCount = 0;

  for (const payload of SQLI_PAYLOADS) {
    // 1. Scanner check
    const scan = detectSqlInjection(payload);
    // 2. Classifier check
    const classified = classifyIdentifier(payload);

    // Every single payload MUST either be flagged as suspicious OR classified as INVALID
    const isSafe = scan.isSuspicious || classified.type === 'INVALID';
    assert.strictEqual(
      isSafe,
      true,
      `VULNERABILITY DETECTED: Payload escaped scanner and classification: "${payload}"`
    );

    // 3. Server auth store lookup check: findUser MUST return null
    const userResult = await serverAuthStore.findUser(payload);
    assert.strictEqual(
      userResult,
      null,
      `CRITICAL AUTH BYPASS: findUser returned account for SQL injection payload: "${payload}"`
    );

    // 4. Repository slug lookup check: getCampaignBySlugOrId MUST return null
    const campaignResult = await ClipBDRepository.getCampaignBySlugOrId(payload);
    assert.strictEqual(
      campaignResult,
      null,
      `REPOSITORY INJECTION: getCampaignBySlugOrId returned result for SQL injection payload: "${payload}"`
    );

    // 5. Sanitizer test
    const sanitized = sanitizeSqlSafeText(payload);
    assert.strictEqual(
      /['";`]/.test(sanitized),
      false,
      `SANITIZER FAILED: Quotes or semicolons remained in sanitized output: "${sanitized}"`
    );

    blockedCount++;
  }

  console.log(`[PASS] 100% of ${blockedCount} SQL injection payloads were successfully blocked and rejected.`);

  console.log("\nVerifying legitimate inputs are NOT falsely flagged (Zero False Positives):");
  for (const legit of LEGITIMATE_INPUTS) {
    const scan = detectSqlInjection(legit.input);
    assert.strictEqual(
      scan.isSuspicious,
      false,
      `FALSE POSITIVE: Legitimate input flagged as SQLi: "${legit.input}"`
    );

    const classified = classifyIdentifier(legit.input);
    assert.strictEqual(
      classified.type,
      legit.expectedType,
      `MISCLASSIFICATION: Expected ${legit.expectedType} for "${legit.input}", got ${classified.type}`
    );
    console.log(`  ✓ "${legit.input}" -> ${classified.type} (Clean)`);
  }

  console.log("\nTesting HTTP API Login Route against SQL Injection payloads:");
  const { POST: handleLogin } = await import('../app/api/auth/login/route');
  for (const payload of ["' or 1=1--", "admin'--", "'; DROP TABLE users;--", "' UNION SELECT NULL--"]) {
    const req = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: payload, password: 'password123' }),
    });
    const res = await handleLogin(req);
    const json = await res.json();
    assert.strictEqual(res.status, 400, `Expected 400 for SQLi payload, got ${res.status}`);
    assert.strictEqual(json.success, false);
    console.log(`  ✓ Blocked "${payload}" -> HTTP ${res.status} (${json.error})`);
  }

  console.log("\n=== ALL ANTI-SQL INJECTION TESTS PASSED (0 FAILURES) ===");
}

runTestSuite().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
