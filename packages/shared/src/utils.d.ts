import type { ApiResponse } from './types';
export declare const createSuccessResponse: <T>(data: T, message?: string) => ApiResponse<T>;
export declare const createErrorResponse: (error: string) => ApiResponse<never>;
export declare const formatDate: (date: Date | string) => string;
export declare const isValidDate: (dateString: string) => boolean;
export declare const getCurrentMonth: () => string;
export declare const parseMonth: (monthString: string) => {
    year: number;
    month: number;
};
export declare const sanitizeString: (str: string) => string;
export declare const calculatePercentage: (value: number, total: number) => number;
export declare const generateId: () => string;
//# sourceMappingURL=utils.d.ts.map