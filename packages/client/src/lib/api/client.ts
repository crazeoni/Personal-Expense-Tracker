import type { ApiResponse } from '@expense-tracker/shared';
import { API_BASE_URL, getAuthHeaders } from './config';

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  
  if (!response.ok || !data.success) {
    throw new ApiError(response.status, data.error || 'Request failed');
  }
  
  return data.data as T;
};

export const apiClient = {
  get: async <T>(path: string, params?: Record<string, string>): Promise<T> => {
    const url = new URL(`${API_BASE_URL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleResponse<T>(response);
  },
  
  post: async <T, D = unknown>(path: string, data?: D): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return handleResponse<T>(response);
  },
  
  put: async <T, D = unknown>(path: string, data?: D): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return handleResponse<T>(response);
  },
  
  delete: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse<T>(response);
  },
};

export { ApiError };