/**
 * Aegis Guardrails & Security Protocol for AI Persona Chatbot
 * Enforces strict prompt injection protection, PII data privacy, and domain boundary grounding.
 */

export interface GuardrailCheckResult {
  allowed: boolean;
  reason?: string;
  refusalMessage?: string;
}

// Patterns used by malicious actors to attempt prompt injection or persona hijacking
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(a|an|in)\s+/i,
  /system\s+prompt/i,
  /reveal\s+(the\s+)?(system|api|secret|key|prompt)/i,
  /forget\s+(your\s+)?(rules|instructions|guardrails)/i,
  /override\s+(security|safety|rules)/i,
  /act\s+as\s+(dan|jailbreak|unrestricted)/i,
  /disregard\s+all/i,
  /print\s+(the\s+)?(initial|system)\s+prompt/i,
  /developer\s+mode/i,
];

// Patterns for sensitive PII or inappropriate personal queries
const SENSITIVE_PII_PATTERNS = [
  /(home|personal)\s+address/i,
  /(private|personal)\s+phone\s*number/i,
  /social\s+security/i,
  /bank\s+account|credit\s+card/i,
  /password|pin\s+number/i,
  /financial\s+details/i,
];

/**
 * Evaluates incoming user prompts against strict safety guardrails.
 */
export function checkInputGuardrails(userMessage: string): GuardrailCheckResult {
  const trimmed = userMessage.trim();

  // 1. Anti-Injection Check
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        reason: 'PROMPT_INJECTION_ATTEMPT',
        refusalMessage: `[Aegis Guardrail Alert]: I am B S Naveen's AI Advocate. I strictly operate under security guardrails and cannot alter my system directives or reveal internal prompts.\n\n[Source: Verified Security Protocol]`,
      };
    }
  }

  // 2. Sensitive PII Privacy Check
  for (const pattern of SENSITIVE_PII_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        reason: 'SENSITIVE_PII_REQUEST',
        refusalMessage: `[Aegis Privacy Protection]: I respond exclusively from verified engineering background and portfolio records for B S Naveen. I decline to discuss unlisted or private personal contact details.\n\n[Source: Data Protection Guardrail]`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Sanitizes output text to ensure zero accidental PII leakage.
 */
export function sanitizeOutput(text: string): string {
  // Redact potential SSN, credit cards, or raw auth tokens if accidentally echoed
  return text
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED SSN]')
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED CARD]')
    .replace(/(AIzaSy|sk-[a-zA-Z0-9]{32,})/g, '[REDACTED API KEY]');
}
