export const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
] as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  EXPENSES: {
    LIST: '/expenses',
    CREATE: '/expenses',
    GET: '/expenses/:id',
    UPDATE: '/expenses/:id',
    DELETE: '/expenses/:id',
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    DELETE: '/categories/:id',
  },
  REPORTS: {
    MONTHLY: '/reports/monthly',
    BY_CATEGORY: '/reports/by-category',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  EXPENSE_NOT_FOUND: 'Expense not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  INVALID_INPUT: 'Invalid input data',
  INTERNAL_ERROR: 'Internal server error',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
} as const;