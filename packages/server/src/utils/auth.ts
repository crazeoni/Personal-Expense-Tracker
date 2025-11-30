// packages/server/utils/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import type { User } from '@expense-tracker/shared';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export interface JwtPayload {
  userId: string;
  email: string;
}

if (!config?.jwt?.secret) {
  throw new Error('JWT secret is not set in config');
}

export const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  // TypeScript/jwt typing can be picky — cast options as any to match runtime signature
  return jwt.sign(payload, config.jwt.secret as any, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.secret as any) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
