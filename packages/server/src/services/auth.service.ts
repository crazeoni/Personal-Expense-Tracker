import type { User, AuthResponse } from '@expense-tracker/shared';
import { ERROR_MESSAGES, DEFAULT_CATEGORIES } from '@expense-tracker/shared';
import { getUsersCollection, getCategoriesCollection } from '../db/collections';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';

interface UserDocument extends Omit<User, 'id'> {
  _id: string;
  passwordHash: string;
}

const userDocToUser = (doc: UserDocument): User => ({
  id: doc._id,
  email: doc.email,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const registerUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {

  const usersCol = getUsersCollection();
  const categoriesCol = getCategoriesCollection();

  // Check if user exists
  const existingUser = await usersCol.findOne({ email });
  if (existingUser) {
    throw new Error(ERROR_MESSAGES.USER_EXISTS);
  }


  // Create user
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const userDoc: UserDocument = {
    _id: userId,
    email,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  await usersCol.insertOne(userDoc);

  // Default categories for user
  const defaultCategories = DEFAULT_CATEGORIES.map((name) => ({
    _id: `cat_${userId}_${name.toLowerCase()}`,
    userId,
    name,
    isDefault: true,
    createdAt: now,
  }));

  await categoriesCol.insertMany(defaultCategories);

  const user = userDocToUser(userDoc);
  const token = generateToken(user);

  return {
    user,
    tokens: {
      accessToken: token,
    },
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const usersCol = getUsersCollection();


  const userDoc = await usersCol.findOne({ email });
  if (!userDoc) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }


  const isValidPassword = await comparePasswords(password, userDoc.passwordHash);
  if (!isValidPassword) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }


  const user = userDocToUser(userDoc);
  const token = generateToken(user);

  return {
    user,
    tokens: {
      accessToken: token,
    },
  };
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const usersCol = getUsersCollection();
  const userDoc = await usersCol.findOne({ _id: userId });
  
  if (!userDoc) {
    return null;
  }
  
  return userDocToUser(userDoc);
};