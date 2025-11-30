import type { AuthResponse, RegisterInput, LoginInput } from '@expense-tracker/shared';
import { API_ENDPOINTS } from '@expense-tracker/shared';
import { apiClient } from './client';

export const authApi = {
  register: (input: RegisterInput): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse, RegisterInput>(API_ENDPOINTS.AUTH.REGISTER, input);
  },

  login: (input: LoginInput): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse, LoginInput>(API_ENDPOINTS.AUTH.LOGIN, input);
  },
};