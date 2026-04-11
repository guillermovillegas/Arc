import { describe, it, expect } from 'vitest';
import { paginate, paginatedResponse, paginationSchema } from '../../utils/pagination';

describe('Pagination utilities', () => {
  describe('paginationSchema', () => {
    it('parses valid page and pageSize', () => {
      const result = paginationSchema.parse({ page: 2, pageSize: 10 });
      expect(result).toEqual({ page: 2, pageSize: 10 });
    });

    it('applies default values when fields are omitted', () => {
      const result = paginationSchema.parse({});
      expect(result).toEqual({ page: 1, pageSize: 20 });
    });

    it('coerces string values to numbers', () => {
      const result = paginationSchema.parse({ page: '3', pageSize: '25' });
      expect(result).toEqual({ page: 3, pageSize: 25 });
    });

    it('rejects page less than 1', () => {
      expect(() => paginationSchema.parse({ page: 0 })).toThrow();
      expect(() => paginationSchema.parse({ page: -1 })).toThrow();
    });

    it('rejects pageSize greater than 100', () => {
      expect(() => paginationSchema.parse({ pageSize: 101 })).toThrow();
    });

    it('rejects pageSize less than 1', () => {
      expect(() => paginationSchema.parse({ pageSize: 0 })).toThrow();
    });
  });

  describe('paginate', () => {
    it('returns skip 0 and correct take for page 1', () => {
      const result = paginate({ page: 1, pageSize: 20 });
      expect(result).toEqual({ skip: 0, take: 20 });
    });

    it('returns correct skip for page 2', () => {
      const result = paginate({ page: 2, pageSize: 20 });
      expect(result).toEqual({ skip: 20, take: 20 });
    });

    it('returns correct skip for page 5 with pageSize 10', () => {
      const result = paginate({ page: 5, pageSize: 10 });
      expect(result).toEqual({ skip: 40, take: 10 });
    });

    it('handles pageSize of 1', () => {
      const result = paginate({ page: 3, pageSize: 1 });
      expect(result).toEqual({ skip: 2, take: 1 });
    });

    it('handles large page numbers', () => {
      const result = paginate({ page: 1000, pageSize: 50 });
      expect(result).toEqual({ skip: 49950, take: 50 });
    });
  });

  describe('paginatedResponse', () => {
    it('formats response with correct metadata', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const result = paginatedResponse(items, 50, { page: 1, pageSize: 20 });
      expect(result).toEqual({
        items: [{ id: 1 }, { id: 2 }],
        total: 50,
        page: 1,
        pageSize: 20,
        totalPages: 3,
      });
    });

    it('calculates totalPages correctly when total divides evenly', () => {
      const result = paginatedResponse([], 100, { page: 1, pageSize: 25 });
      expect(result.totalPages).toBe(4);
    });

    it('calculates totalPages correctly when total does not divide evenly', () => {
      const result = paginatedResponse([], 101, { page: 1, pageSize: 25 });
      expect(result.totalPages).toBe(5); // Math.ceil(101/25) = 5
    });

    it('returns totalPages of 0 when there are no items', () => {
      const result = paginatedResponse([], 0, { page: 1, pageSize: 20 });
      expect(result.totalPages).toBe(0);
    });

    it('returns totalPages of 1 when total equals pageSize', () => {
      const result = paginatedResponse([], 20, { page: 1, pageSize: 20 });
      expect(result.totalPages).toBe(1);
    });

    it('returns totalPages of 1 when total is less than pageSize', () => {
      const result = paginatedResponse([], 5, { page: 1, pageSize: 20 });
      expect(result.totalPages).toBe(1);
    });

    it('preserves the items array reference', () => {
      const items = ['a', 'b', 'c'];
      const result = paginatedResponse(items, 3, { page: 1, pageSize: 10 });
      expect(result.items).toBe(items);
    });

    it('works with an empty items array', () => {
      const result = paginatedResponse([], 100, { page: 6, pageSize: 20 });
      expect(result.items).toEqual([]);
      expect(result.page).toBe(6);
      expect(result.totalPages).toBe(5);
    });
  });
});
