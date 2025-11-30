import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createExpenseSchema: z.ZodObject<{
    amount: z.ZodNumber;
    description: z.ZodString;
    category: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    amount: number;
    description: string;
    category: string;
}, {
    date: string;
    amount: number;
    description: string;
    category: string;
}>;
export declare const updateExpenseSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date?: string | undefined;
    amount?: number | undefined;
    description?: string | undefined;
    category?: string | undefined;
}, {
    date?: string | undefined;
    amount?: number | undefined;
    description?: string | undefined;
    category?: string | undefined;
}>;
export declare const expenseQuerySchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    minAmount: z.ZodOptional<z.ZodNumber>;
    maxAmount: z.ZodOptional<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<["date", "amount", "createdAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    sortBy: "date" | "amount" | "createdAt";
    sortOrder: "asc" | "desc";
    category?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    minAmount?: number | undefined;
    maxAmount?: number | undefined;
}, {
    page?: number | undefined;
    pageSize?: number | undefined;
    sortBy?: "date" | "amount" | "createdAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    category?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    minAmount?: number | undefined;
    maxAmount?: number | undefined;
}>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
//# sourceMappingURL=validation.d.ts.map