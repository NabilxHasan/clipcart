// ClipCart - Robust Email & Domain Verification Engine
// Prevents fake signups, catches mistyped domains (@gmai.com, @gmal.com, etc.),
// and blocks disposable/temporary email addresses.

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  errorBn?: string;
  suggestion?: string;
  normalizedEmail?: string;
}

// Common domain typos mapped to their authentic counterparts
const TYPO_DOMAIN_MAP: Record<string, string> = {
  // Gmail typos
  'gmai.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'gmaul.com': 'gmail.com',
  'gmaii.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmai.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.cpm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmailc.om': 'gmail.com',
  'gmaile.com': 'gmail.com',
  'gemail.com': 'gmail.com',
  'gamail.com': 'gmail.com',
  'gmaio.com': 'gmail.com',
  'gmaul.co': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'g-mail.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'gmael.com': 'gmail.com',

  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yaho.comm': 'yahoo.com',
  'ymail.con': 'ymail.com',
  'yahoogroups.com': 'yahoo.com',

  // Hotmail / Outlook typos
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotamail.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outlook.co': 'outlook.com',

  // iCloud typos
  'iclloud.com': 'icloud.com',
  'iclod.com': 'icloud.com',
  'icould.com': 'icloud.com',
};

// Known temporary, disposable, or obvious fake email domains
const DISPOSABLE_OR_FAKE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'yopmail.com',
  'trashmail.com',
  'dispostable.com',
  'fakeinbox.com',
  'throwawaymail.com',
  'getairmail.com',
  'mohmal.com',
  'crazymailing.com',
  'nada.ltd',
  'burnermail.io',
  'inboxkitten.com',
  'generator.email',
  'mytemp.email',
  'fakemail.net',
  'trashmail.net',
  'tempail.com',
  'fake.com',
  'fakegmail.com',
  'test.com',
  'example.com',
  'sample.com',
  'asdf.com',
  'none.com',
  'temp.com',
  'trash.com',
  'invalid.com',
  'nowhere.com',
]);

// RFC 5322 standard email structure
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateEmail(rawEmail: string): EmailValidationResult {
  const email = (rawEmail || '').trim().toLowerCase();

  // 1. Basic presence and length
  if (!email) {
    return {
      isValid: false,
      error: 'Email address is required.',
      errorBn: 'ইমেইল ঠিকানা প্রদান করা আবশ্যক।',
    };
  }

  if (email.length < 6 || email.length > 254) {
    return {
      isValid: false,
      error: 'Email must be between 6 and 254 characters.',
      errorBn: 'ইমেইল ঠিকানা ৬ থেকে ২৫৪ অক্ষরের মধ্যে হতে হবে।',
    };
  }

  // 2. Must contain exactly one '@'
  const atParts = email.split('@');
  if (atParts.length !== 2) {
    return {
      isValid: false,
      error: 'Please enter a valid email address with a single "@" symbol.',
      errorBn: 'সঠিক ইমেইল ঠিকানা দিন (একটি মাত্র "@" প্রতীক থাকবে)।',
    };
  }

  const [localPart, domain] = atParts;

  // 3. Local part basic syntax
  if (!localPart || localPart.length < 2) {
    return {
      isValid: false,
      error: 'The username part of your email is too short (min 2 characters).',
      errorBn: 'ইমেইলের ইউজারনেম অংশটি অতিরিক্ত ছোট (কমপক্ষে ২ অক্ষর হতে হবে)।',
    };
  }

  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return {
      isValid: false,
      error: 'Email username cannot start, end, or contain consecutive dots.',
      errorBn: 'ইমেইলের ইউজারনেম ডট (.) দিয়ে শুরু, শেষ বা পাশাপাশি ডট থাকতে পারবে না।',
    };
  }

  // 4. Domain & TLD validation
  if (!domain || !domain.includes('.')) {
    return {
      isValid: false,
      error: 'Email is missing a valid domain extension (e.g. @gmail.com).',
      errorBn: 'ইমেইলে সঠিক ডোমেইন ও এক্সটেনশন নেই (যেমনঃ @gmail.com)।',
    };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];

  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return {
      isValid: false,
      error: 'Email domain has an invalid extension (e.g. must end in .com, .net, .bd, etc.).',
      errorBn: 'ইমেইল ডোমেইনের এক্সটেনশন সঠিক নয় (যেমনঃ .com, .net, .bd ইত্যাদি হতে হবে)।',
    };
  }

  // 5. Check for common domain typos (e.g., @gmai.com)
  if (TYPO_DOMAIN_MAP[domain]) {
    const correctedDomain = TYPO_DOMAIN_MAP[domain];
    const suggestion = `${localPart}@${correctedDomain}`;
    return {
      isValid: false,
      error: `Invalid email domain "${domain}". Did you mean "@${correctedDomain}"?`,
      errorBn: `ভুল ইমেইল ডোমেইন "${domain}"। আপনি কি "@${correctedDomain}" বোঝাতে চেয়েছেন?`,
      suggestion,
    };
  }

  // 6. Check for disposable, temporary, or known fake domains
  if (DISPOSABLE_OR_FAKE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Temporary, disposable, or test email addresses are not permitted. Please use your genuine email.',
      errorBn: 'অস্থায়ী বা ফেক ইমেইল গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল ইমেইল ব্যবহার করুন।',
    };
  }

  // 7. Obvious fake local parts
  const fakeLocalParts = ['test', 'fake', 'asdf', 'dummy', 'none', '123456', 'noreply', 'admin'];
  if (fakeLocalParts.includes(localPart)) {
    return {
      isValid: false,
      error: `"${localPart}" appears to be a test address. Please provide your real active email.`,
      errorBn: `"${localPart}" একটি ডামি ইমেইল মনে হচ্ছে। দয়া করে আপনার সক্রিয় ব্যক্তিগত ইমেইল দিন।`,
    };
  }

  // 8. Full RFC 5322 regex match
  if (!EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email address format. Please check for unexpected characters.',
      errorBn: 'ইমেইল ফরম্যাট সঠিক নয়। কোনো ভুল অক্ষর আছে কিনা পরীক্ষা করুন।',
    };
  }

  return {
    isValid: true,
    normalizedEmail: email,
  };
}
