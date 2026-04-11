import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Mock the env config before importing the module under test.
// The real env module calls process.exit(1) when required env vars are missing,
// so we intercept it entirely.
vi.mock('../../config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-minimum-16chars',
    JWT_REFRESH_SECRET: 'test-refresh-secret-minimum-16',
  },
}));

import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';

describe('JWT utilities', () => {
  const payload = { userId: 'user-123', role: 'CLIENT' };

  describe('signAccessToken', () => {
    it('creates a valid JWT string', () => {
      const token = signAccessToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // header.payload.signature
    });

    it('embeds userId and role in the token payload', () => {
      const token = signAccessToken(payload);
      const decoded = jwt.decode(token) as Record<string, unknown>;
      expect(decoded.userId).toBe('user-123');
      expect(decoded.role).toBe('CLIENT');
    });

    it('sets an expiration claim', () => {
      const token = signAccessToken(payload);
      const decoded = jwt.decode(token) as Record<string, unknown>;
      expect(decoded.exp).toBeDefined();
      expect(typeof decoded.exp).toBe('number');
    });

    it('can be verified with the correct secret', () => {
      const token = signAccessToken(payload);
      const verified = jwt.verify(token, 'test-secret-minimum-16chars') as Record<string, unknown>;
      expect(verified.userId).toBe('user-123');
      expect(verified.role).toBe('CLIENT');
    });

    it('cannot be verified with the wrong secret', () => {
      const token = signAccessToken(payload);
      expect(() => jwt.verify(token, 'wrong-secret-xxxxxxxxx')).toThrow();
    });
  });

  describe('signRefreshToken', () => {
    it('creates a valid JWT string', () => {
      const token = signRefreshToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('embeds userId and role in the token payload', () => {
      const token = signRefreshToken(payload);
      const decoded = jwt.decode(token) as Record<string, unknown>;
      expect(decoded.userId).toBe('user-123');
      expect(decoded.role).toBe('CLIENT');
    });

    it('sets an expiration claim', () => {
      const token = signRefreshToken(payload);
      const decoded = jwt.decode(token) as Record<string, unknown>;
      expect(decoded.exp).toBeDefined();
    });

    it('uses a different secret than access tokens', () => {
      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);
      // Refresh token should NOT verify with the access token secret
      expect(() => jwt.verify(refreshToken, 'test-secret-minimum-16chars')).toThrow();
      // Access token should NOT verify with the refresh token secret
      expect(() => jwt.verify(accessToken, 'test-refresh-secret-minimum-16')).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('returns the decoded payload for a valid refresh token', () => {
      const token = signRefreshToken(payload);
      const result = verifyRefreshToken(token);
      expect(result.userId).toBe('user-123');
      expect(result.role).toBe('CLIENT');
    });

    it('throws for an invalid token string', () => {
      expect(() => verifyRefreshToken('not-a-valid-token')).toThrow();
    });

    it('throws for a token signed with a different secret', () => {
      const token = jwt.sign(payload, 'some-other-secret-value-1234');
      expect(() => verifyRefreshToken(token)).toThrow();
    });

    it('throws for an expired token', () => {
      const token = jwt.sign(payload, 'test-refresh-secret-minimum-16', {
        expiresIn: '-10s', // already expired
      });
      expect(() => verifyRefreshToken(token)).toThrow();
    });

    it('throws for an access token (wrong secret)', () => {
      const accessToken = signAccessToken(payload);
      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });
  });
});
