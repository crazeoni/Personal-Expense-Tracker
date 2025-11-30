import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateCategoryInput } from '@expense-tracker/shared';
import { categoriesApi } from '../api/categories';

const CATEGORIES_KEY = ['categories'];

export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => categoriesApi.list(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoriesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};