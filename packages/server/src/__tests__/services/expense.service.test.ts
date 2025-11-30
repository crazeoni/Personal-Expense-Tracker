// packages/server/src/__tests__/services/expense.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createExpense, getExpenses } from '../../services/expense.service';
import { getExpensesCollection } from '../../db/collections';
import 'dotenv/config';


// Mock database
vi.mock('../../db/collections');

describe('ExpenseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createExpense', () => {
    it('should create expense with correct data', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ insertedId: 'exp_123' });
      vi.mocked(getExpensesCollection).mockReturnValue({
        insertOne: mockInsert,
      } as any);

      const expense = await createExpense('user_1', {
        amount: 50,
        description: 'Lunch',
        category: 'Food',
        date: '2024-01-15',
      });

      expect(expense.userId).toBe('user_1');
      expect(expense.amount).toBe(50);
      expect(mockInsert).toHaveBeenCalledOnce();
    });

    it('should throw error for invalid amount', async () => {
      await expect(createExpense('user_1', {
        amount: -10,
        description: 'Invalid',
        category: 'Food',
        date: '2024-01-15',
      })).rejects.toThrow();
    });
  });

  describe('getExpenses', () => {
    it('should return paginated expenses', async () => {
      const mockExpenses = [
        { _id: 'exp_1', amount: 50, description: 'Lunch' },
        { _id: 'exp_2', amount: 30, description: 'Coffee' },
      ];

      const mockFind = vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue(mockExpenses),
      });

      const mockCount = vi.fn().mockResolvedValue(2);

      vi.mocked(getExpensesCollection).mockReturnValue({
        find: mockFind,
        countDocuments: mockCount,
      } as any);

      const result = await getExpenses('user_1', {}, 1, 10);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });
  });
});