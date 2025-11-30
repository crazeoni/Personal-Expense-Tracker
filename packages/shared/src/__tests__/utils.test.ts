// packages/shared/src/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, calculatePercentage, sanitizeString } from '../utils';

describe('utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should handle string input', () => {
      expect(formatDate('2024-01-15')).toBe('2024-01-15');
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(50, 200)).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });
  });

  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });
  });
});