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

  console.log(`[DEBUG REGISTER] Attempting to register email: ${email}`); // ADDED LOG
  const usersCol = getUsersCollection();
  const categoriesCol = getCategoriesCollection();

  // Check if user exists
  const existingUser = await usersCol.findOne({ email });
  if (existingUser) {
    console.log(`[DEBUG REGISTER] User already exists: ${email}`); // ADDED LOG
    throw new Error(ERROR_MESSAGES.USER_EXISTS);
  }

  console.log(`[DEBUG REGISTER] User does not exist, creating new user...`); // ADDED LOG

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
  console.log(`[DEBUG REGISTER] User created successfully.`); // ADDED LOG

  // Create default categories for user
  const defaultCategories = DEFAULT_CATEGORIES.map((name) => ({
    _id: `cat_${userId}_${name.toLowerCase()}`,
    userId,
    name,
    isDefault: true,
    createdAt: now,
  }));

  await categoriesCol.insertMany(defaultCategories);
  console.log(`[DEBUG REGISTER] Default categories created.`); // ADDED LOG

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

  console.log(`[DEBUG] Login attempt for email: ${email}`); // ADDED LOG

  const userDoc = await usersCol.findOne({ email });
  if (!userDoc) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  console.log(`[DEBUG] User found. Comparing passwords...`); // ADDED LOG

  const isValidPassword = await comparePasswords(password, userDoc.passwordHash);
  if (!isValidPassword) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  console.log(`[DEBUG] Password is valid! Generating token.`); // ADDED LOG

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