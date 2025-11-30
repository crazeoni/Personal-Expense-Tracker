import type { MonthlyReport, CategoryReport } from '@expense-tracker/shared';
import { calculatePercentage } from '@expense-tracker/shared';
import { getExpensesCollection } from '../db/collections';

export const getMonthlyReport = async (
  userId: string,
  month: string
): Promise<MonthlyReport> => {
  const expensesCol = getExpensesCollection();
  
  const startDate = `${month}-01`;
  const endDate = `${month}-31`;
  
  const expenses = await expensesCol
    .find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    })
    .sort({ date: -1 })
    .toArray();
  
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  return {
    month,
    total,
    expenses: expenses.map((doc) => ({
      id: doc._id,
      userId: doc.userId,
      amount: doc.amount,
      description: doc.description,
      category: doc.category,
      date: doc.date,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
  };
};

export const getCategoryReport = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<CategoryReport[]> => {
  const expensesCol = getExpensesCollection();
  
  const query: Record<string, unknown> = { userId };
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      (query.date as Record<string, string>).$gte = startDate;
    }
    if (endDate) {
      (query.date as Record<string, string>).$lte = endDate;
    }
  }
  
  const expenses = await expensesCol.find(query).toArray();
  
  const categoryMap = new Map<string, { total: number; count: number }>();
  
  expenses.forEach((exp) => {
    const current = categoryMap.get(exp.category) || { total: 0, count: 0 };
    categoryMap.set(exp.category, {
      total: current.total + exp.amount,
      count: current.count + 1,
    });
  });
  
  const grandTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const reports: CategoryReport[] = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: calculatePercentage(data.total, grandTotal),
    }))
    .sort((a, b) => b.total - a.total);
  
  return reports;
};