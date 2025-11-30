import type { User, Expense, Category } from '@expense-tracker/shared';

// Type used for MongoDB documents (uses _id instead of id)
export interface UserDocument extends Omit<User, 'id'> {
  _id: string; 
  passwordHash: string; // Keep this field here as it's DB-only
}

export interface ExpenseDocument extends Omit<Expense, 'id'> {
  _id: string;
}

export interface CategoryDocument extends Omit<Category, 'id'> {
  _id: string;
}