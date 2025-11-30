"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = exports.calculatePercentage = exports.sanitizeString = exports.parseMonth = exports.getCurrentMonth = exports.isValidDate = exports.formatDate = exports.createErrorResponse = exports.createSuccessResponse = void 0;
const createSuccessResponse = (data, message) => ({
    success: true,
    data,
    message,
});
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (error) => ({
    success: false,
    error,
});
exports.createErrorResponse = createErrorResponse;
const formatDate = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const isoString = d.toISOString().split('T')[0];
    if (!isoString) {
        throw new Error('Invalid date format');
    }
    return isoString;
};
exports.formatDate = formatDate;
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString))
        return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
const getCurrentMonth = () => {
    return new Date().toISOString().slice(0, 7);
};
exports.getCurrentMonth = getCurrentMonth;
const parseMonth = (monthString) => {
    const parts = monthString.split('-');
    const year = parts[0] ? parseInt(parts[0], 10) : 0;
    const month = parts[1] ? parseInt(parts[1], 10) : 0;
    return { year, month };
};
exports.parseMonth = parseMonth;
const sanitizeString = (str) => {
    return str.trim().replace(/[<>]/g, '');
};
exports.sanitizeString = sanitizeString;
const calculatePercentage = (value, total) => {
    return total === 0 ? 0 : Math.round((value / total) * 100 * 100) / 100;
};
exports.calculatePercentage = calculatePercentage;
const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
exports.generateId = generateId;
//# sourceMappingURL=utils.js.map