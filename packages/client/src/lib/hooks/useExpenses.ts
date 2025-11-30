import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateExpenseInput, UpdateExpenseInput, ExpenseQueryInput } from '@expense-tracker/shared';
import { expensesApi } from '../api/expenses';

const EXPENSES_KEY = ['expenses'];

export const useExpenses = (query?: Partial<ExpenseQueryInput>) => {
  return useQuery({
    queryKey: [...EXPENSES_KEY, query],
    queryFn: () => expensesApi.list(query),
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExpenseInput) => expensesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateExpenseInput }) =>
      expensesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
};