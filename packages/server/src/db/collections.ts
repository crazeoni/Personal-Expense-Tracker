// src/db/collections.ts

import { Collection } from 'mongodb';
// Import the new document types
import type { UserDocument, ExpenseDocument, CategoryDocument } from './types'; // Adjust path if needed
import { getDatabase } from './client';

export const COLLECTION_NAMES = {
  USERS: 'users',
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
} as const;

// Update the functions to return the Document type
export const getUsersCollection = (): Collection<UserDocument> => {
  return getDatabase().collection<UserDocument>(COLLECTION_NAMES.USERS);
};

export const getExpensesCollection = (): Collection<ExpenseDocument> => {
  return getDatabase().collection<ExpenseDocument>(COLLECTION_NAMES.EXPENSES);
};

export const getCategoriesCollection = (): Collection<CategoryDocument> => {
  return getDatabase().collection<CategoryDocument>(COLLECTION_NAMES.CATEGORIES);
};

export const createIndexes = async (): Promise<void> => {
  // This code remains correct because the collection types are now correct
  const usersCol = getUsersCollection();
  const expensesCol = getExpensesCollection();
  const categoriesCol = getCategoriesCollection();

  // Users indexes
  await usersCol.createIndex({ email: 1 }, { unique: true });

  // Expenses indexes
  await expensesCol.createIndex({ userId: 1 });
  await expensesCol.createIndex({ userId: 1, date: -1 });
  await expensesCol.createIndex({ userId: 1, category: 1 });

  // Categories indexes
  await categoriesCol.createIndex({ userId: 1, name: 1 }, { unique: true });

  console.log('Database indexes created');
};
