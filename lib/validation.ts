// Phone validation + normalisation.
//
// The mobile number is the applicant's identity (primary key) across the whole
// journey, so it must normalise to ONE canonical form regardless of how the user
// types it: "98765 43210", "+91 98765-43210", "919876543210" all collapse to the
// same key. We target Indian mobiles (10 digits starting 6–9, optional +91 / 91).

const INDIAN_MOBILE = /^[6-9]\d{9}$/;

/**
 * Reduce any user-entered phone string to its canonical E.164 form
 * (`+91XXXXXXXXXX`), or return `null` if it isn't a valid Indian mobile.
 */
export function normaliseMobile(raw: string): string | null {
  const digits = (raw || '').replace(/\D/g, '');
  // Drop a leading country code if present (91XXXXXXXXXX → XXXXXXXXXX).
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (!INDIAN_MOBILE.test(local)) return null;
  return `+91${local}`;
}

/** True if the string is a valid Indian mobile number. */
export function isValidMobile(raw: string): boolean {
  return normaliseMobile(raw) !== null;
}

/** A name is acceptable once it has at least two non-space characters. */
export function isValidName(raw: string): boolean {
  return (raw || '').trim().length >= 2;
}
