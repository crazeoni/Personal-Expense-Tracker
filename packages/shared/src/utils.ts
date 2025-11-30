import type { ApiResponse } from './types';

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const createErrorResponse = (error: string): ApiResponse<never> => ({
  success: false,
  error,
});

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const isoString = d.toISOString().split('T')[0];
  if (!isoString) {
    throw new Error('Invalid date format');
  }
  return isoString;
};

export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

export const parseMonth = (monthString: string): { year: number; month: number } => {
  const parts = monthString.split('-');
  const year = parts[0] ? parseInt(parts[0], 10) : 0;
  const month = parts[1] ? parseInt(parts[1], 10) : 0;
  return { year, month };
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100 * 100) / 100;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};