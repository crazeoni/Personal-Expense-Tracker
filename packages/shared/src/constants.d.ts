export declare const DEFAULT_CATEGORIES: readonly ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Healthcare", "Education", "Other"];
export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly REGISTER: "/auth/register";
        readonly LOGIN: "/auth/login";
        readonly REFRESH: "/auth/refresh";
        readonly LOGOUT: "/auth/logout";
    };
    readonly EXPENSES: {
        readonly LIST: "/expenses";
        readonly CREATE: "/expenses";
        readonly GET: "/expenses/:id";
        readonly UPDATE: "/expenses/:id";
        readonly DELETE: "/expenses/:id";
    };
    readonly CATEGORIES: {
        readonly LIST: "/categories";
        readonly CREATE: "/categories";
        readonly DELETE: "/categories/:id";
    };
    readonly REPORTS: {
        readonly MONTHLY: "/reports/monthly";
        readonly BY_CATEGORY: "/reports/by-category";
    };
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const ERROR_MESSAGES: {
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly INVALID_CREDENTIALS: "Invalid email or password";
    readonly USER_EXISTS: "User already exists";
    readonly USER_NOT_FOUND: "User not found";
    readonly EXPENSE_NOT_FOUND: "Expense not found";
    readonly CATEGORY_NOT_FOUND: "Category not found";
    readonly INVALID_INPUT: "Invalid input data";
    readonly INTERNAL_ERROR: "Internal server error";
    readonly TOKEN_EXPIRED: "Token has expired";
    readonly INVALID_TOKEN: "Invalid token";
};
//# sourceMappingURL=constants.d.ts.map