import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../../utils/password';

describe('Password utilities', () => {
  const plaintext = 'MySecureP@ss1';

  describe('hashPassword', () => {
    it('returns a string that differs from the plaintext', async () => {
      const hashed = await hashPassword(plaintext);
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(plaintext);
    });

    it('returns a bcrypt-formatted hash', async () => {
      const hashed = await hashPassword(plaintext);
      // bcrypt hashes start with $2a$ or $2b$
      expect(hashed).toMatch(/^\$2[aby]\$/);
    });

    it('produces different hashes for the same input due to salting', async () => {
      const hash1 = await hashPassword(plaintext);
      const hash2 = await hashPassword(plaintext);
      expect(hash1).not.toBe(hash2);
    });

    it('produces a hash of expected length', async () => {
      const hashed = await hashPassword(plaintext);
      // bcrypt hashes are always 60 characters
      expect(hashed).toHaveLength(60);
    });
  });

  describe('comparePassword', () => {
    it('returns true when plaintext matches the hash', async () => {
      const hashed = await hashPassword(plaintext);
      const result = await comparePassword(plaintext, hashed);
      expect(result).toBe(true);
    });

    it('returns false when plaintext does not match the hash', async () => {
      const hashed = await hashPassword(plaintext);
      const result = await comparePassword('WrongPassword1!', hashed);
      expect(result).toBe(false);
    });

    it('returns false for an empty string compared to a valid hash', async () => {
      const hashed = await hashPassword(plaintext);
      const result = await comparePassword('', hashed);
      expect(result).toBe(false);
    });

    it('works correctly across multiple hash/compare cycles', async () => {
      const passwords = ['alpha1!A', 'Beta2@BB', 'gamma3#CCC'];
      for (const pw of passwords) {
        const hashed = await hashPassword(pw);
        expect(await comparePassword(pw, hashed)).toBe(true);
        expect(await comparePassword(pw + 'x', hashed)).toBe(false);
      }
    });
  });
});
