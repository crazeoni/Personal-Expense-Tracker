"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorySchema = exports.expenseQuerySchema = exports.updateExpenseSchema = exports.createExpenseSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// User validation schemas
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Expense validation schemas
exports.createExpenseSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Amount must be positive'),
    description: zod_1.z.string().min(1, 'Description is required').max(200, 'Description too long'),
    category: zod_1.z.string().min(1, 'Category is required'),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
exports.updateExpenseSchema = exports.createExpenseSchema.partial();
exports.expenseQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    category: zod_1.z.string().optional(),
    minAmount: zod_1.z.number().positive().optional(),
    maxAmount: zod_1.z.number().positive().optional(),
    page: zod_1.z.number().int().positive().default(1),
    pageSize: zod_1.z.number().int().positive().max(100).default(20),
    sortBy: zod_1.z.enum(['date', 'amount', 'createdAt']).default('date'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
// Category validation schemas
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
});
//# sourceMappingURL=validation.js.map