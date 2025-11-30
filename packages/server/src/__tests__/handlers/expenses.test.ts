// packages/server/src/__tests__/handlers/expenses.test.ts
import { describe, it, expect, vi } from 'vitest';
import { createExpenseHandler } from '../../handlers/expenses';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import 'dotenv/config';


vi.mock('../../db/client');
vi.mock('../../services/expense.service');

describe('ExpenseHandlers', () => {
  const mockEvent: Partial<APIGatewayProxyEvent> = {
    body: JSON.stringify({
      amount: 50,
      description: 'Lunch',
      category: 'Food',
      date: '2024-01-15',
    }),
    requestContext: {
      authorizer: {
        userId: 'user_1',
      },
    } as any,
  };

  it('should create expense successfully', async () => {
    const result = await createExpenseHandler(mockEvent as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
  });

  it('should return 400 for invalid input', async () => {
    const invalidEvent = {
      ...mockEvent,
      body: JSON.stringify({ amount: -10 }),
    };

    const result = await createExpenseHandler(invalidEvent as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
  });
});