"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// packages/shared/src/__tests__/utils.test.ts
const vitest_1 = require("vitest");
const utils_1 = require("../utils");
(0, vitest_1.describe)('utils', () => {
    (0, vitest_1.describe)('formatDate', () => {
        (0, vitest_1.it)('should format date correctly', () => {
            const date = new Date('2024-01-15T12:00:00Z');
            (0, vitest_1.expect)((0, utils_1.formatDate)(date)).toBe('2024-01-15');
        });
        (0, vitest_1.it)('should handle string input', () => {
            (0, vitest_1.expect)((0, utils_1.formatDate)('2024-01-15')).toBe('2024-01-15');
        });
    });
    (0, vitest_1.describe)('calculatePercentage', () => {
        (0, vitest_1.it)('should calculate percentage correctly', () => {
            (0, vitest_1.expect)((0, utils_1.calculatePercentage)(25, 100)).toBe(25);
            (0, vitest_1.expect)((0, utils_1.calculatePercentage)(50, 200)).toBe(25);
        });
        (0, vitest_1.it)('should return 0 when total is 0', () => {
            (0, vitest_1.expect)((0, utils_1.calculatePercentage)(10, 0)).toBe(0);
        });
    });
    (0, vitest_1.describe)('sanitizeString', () => {
        (0, vitest_1.it)('should remove HTML tags', () => {
            (0, vitest_1.expect)((0, utils_1.sanitizeString)('<script>alert("xss")</script>')).toBe('alert("xss")');
        });
        (0, vitest_1.it)('should trim whitespace', () => {
            (0, vitest_1.expect)((0, utils_1.sanitizeString)('  hello  ')).toBe('hello');
        });
    });
});
//# sourceMappingURL=utils.test.js.map