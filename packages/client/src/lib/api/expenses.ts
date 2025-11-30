import type { 
  Expense, 
  PaginatedResponse, 
  CreateExpenseInput, 
  UpdateExpenseInput,
  ExpenseQueryInput 
} from '@expense-tracker/shared';
import { API_ENDPOINTS } from '@expense-tracker/shared';
import { apiClient } from './client';

const buildExpenseUrl = (id: string) => API_ENDPOINTS.EXPENSES.GET.replace(':id', id);

export const expensesApi = {
  list: (query?: Partial<ExpenseQueryInput>): Promise<PaginatedResponse<Expense>> => {
    const params: Record<string, string> = {};
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params[key] = String(value);
        }
      });
    }
    
    return apiClient.get<PaginatedResponse<Expense>>(API_ENDPOINTS.EXPENSES.LIST, params);
  },

  create: (input: CreateExpenseInput): Promise<Expense> => {
    return apiClient.post<Expense, CreateExpenseInput>(API_ENDPOINTS.EXPENSES.CREATE, input);
  },

  get: (id: string): Promise<Expense> => {
    return apiClient.get<Expense>(buildExpenseUrl(id));
  },

  update: (id: string, input: UpdateExpenseInput): Promise<Expense> => {
    return apiClient.put<Expense, UpdateExpenseInput>(buildExpenseUrl(id), input);
  },

  delete: (id: string): Promise<void> => {
    return apiClient.delete<void>(buildExpenseUrl(id));
  },
};