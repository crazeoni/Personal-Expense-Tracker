import type { Expense, ExpenseFilters, PaginatedResponse, CreateExpenseInput, UpdateExpenseInput } from '@expense-tracker/shared';
import { ERROR_MESSAGES } from '@expense-tracker/shared';
import { getExpensesCollection } from '../db/collections';

interface ExpenseDocument extends Omit<Expense, 'id'> {
  _id: string;
}

const expenseDocToExpense = (doc: ExpenseDocument): Expense => ({
  id: doc._id,
  userId: doc.userId,
  amount: doc.amount,
  description: doc.description,
  category: doc.category,
  date: doc.date,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const createExpense = async (
  userId: string,
  input: CreateExpenseInput
): Promise<Expense> => {
  const expensesCol = getExpensesCollection();
  const now = new Date().toISOString();
  const expenseId = `exp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const expenseDoc: ExpenseDocument = {
    _id: expenseId,
    userId,
    amount: input.amount,
    description: input.description,
    category: input.category,
    date: input.date,
    createdAt: now,
    updatedAt: now,
  };

  await expensesCol.insertOne(expenseDoc);
  return expenseDocToExpense(expenseDoc);
};

export const getExpenses = async (
  userId: string,
  filters: ExpenseFilters,
  page = 1,
  pageSize = 20,
  sortBy: 'date' | 'amount' | 'createdAt' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PaginatedResponse<Expense>> => {
  const expensesCol = getExpensesCollection();

  const query: Record<string, unknown> = { userId };

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      (query.date as Record<string, string>).$gte = filters.startDate;
    }
    if (filters.endDate) {
      (query.date as Record<string, string>).$lte = filters.endDate;
    }
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    query.amount = {};
    if (filters.minAmount !== undefined) {
      (query.amount as Record<string, number>).$gte = filters.minAmount;
    }
    if (filters.maxAmount !== undefined) {
      (query.amount as Record<string, number>).$lte = filters.maxAmount;
    }
  }

  const total = await expensesCol.countDocuments(query);
  const skip = (page - 1) * pageSize;

  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const docs = await expensesCol
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(pageSize)
    .toArray();

  const expenses = docs.map(expenseDocToExpense);

  return {
    items: expenses,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getExpenseById = async (
  userId: string,
  expenseId: string
): Promise<Expense | null> => {
  const expensesCol = getExpensesCollection();
  const doc = await expensesCol.findOne({ _id: expenseId, userId });
  
  if (!doc) {
    return null;
  }
  
  return expenseDocToExpense(doc);
};

export const updateExpense = async (
  userId: string,
  expenseId: string,
  input: UpdateExpenseInput
): Promise<Expense> => {
  const expensesCol = getExpensesCollection();
  
  const updateData: Record<string, unknown> = {
    ...input,
    updatedAt: new Date().toISOString(),
  };

  const result = await expensesCol.findOneAndUpdate(
    { _id: expenseId, userId },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result) {
    throw new Error(ERROR_MESSAGES.EXPENSE_NOT_FOUND);
  }

  return expenseDocToExpense(result);
};

export const deleteExpense = async (
  userId: string,
  expenseId: string
): Promise<void> => {
  const expensesCol = getExpensesCollection();
  
  const result = await expensesCol.deleteOne({ _id: expenseId, userId });
  
  if (result.deletedCount === 0) {
    throw new Error(ERROR_MESSAGES.EXPENSE_NOT_FOUND);
  }
};