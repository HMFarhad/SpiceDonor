/** Accept common local/international formatting without requiring a country code. */
export function isValidPhoneNumber(value: string): boolean {
  const input = value.trim();
  if (!input) return true;
  if (!/^\+?[\d\s()-]+$/.test(input)) return false;
  const digits = input.replace(/[\s()-]/g, '');
  return /^(?:0\d{5,14}|\+?[1-9]\d{5,14})$/.test(digits);
}
