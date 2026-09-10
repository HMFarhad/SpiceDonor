import { isValidPhoneNumber } from './phone-validation';

describe('Contact phone numbers', () => {
  it('accepts an omitted optional number and common Finnish formats', () => {
    for (const number of ['', '   ', '0401234567', '040 123 4567', '+358 40 123 4567', '+358 (40) 123-4567', '00358 40 123 4567']) {
      expect(isValidPhoneNumber(number)).withContext(number).toBeTrue();
    }
  });
  it('rejects letters, misplaced plus signs, and implausible lengths', () => {
    for (const number of ['abc', '040hello1234567', '40+1234567', '+0401234567', '123', '1234567890123456', '++358401234567']) {
      expect(isValidPhoneNumber(number)).withContext(number).toBeFalse();
    }
  });
});
