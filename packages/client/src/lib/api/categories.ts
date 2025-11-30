import type { Category, CreateCategoryInput } from '@expense-tracker/shared';
import { API_ENDPOINTS } from '@expense-tracker/shared';
import { apiClient } from './client';

const buildCategoryUrl = (id: string) => API_ENDPOINTS.CATEGORIES.DELETE.replace(':id', id);

export const categoriesApi = {
  list: (): Promise<Category[]> => {
    return apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.LIST);
  },

  create: (input: CreateCategoryInput): Promise<Category> => {
    return apiClient.post<Category, CreateCategoryInput>(API_ENDPOINTS.CATEGORIES.CREATE, input);
  },

  delete: (id: string): Promise<void> => {
    return apiClient.delete<void>(buildCategoryUrl(id));
  },
};