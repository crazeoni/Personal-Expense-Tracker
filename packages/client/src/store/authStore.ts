import { create } from 'zustand';
import type { User } from '@expense-tracker/shared';
import { setAuthToken, removeAuthToken, getAuthToken } from '../lib/api/config';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user, token) => {
    setAuthToken(token);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    removeAuthToken();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user });
  },

  checkAuth: () => {
    const token = getAuthToken();
    const { isAuthenticated } = get();
    return !!token && isAuthenticated;
  },
}));