import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@expense-tracker/shared';
import { setAuthToken, removeAuthToken } from '../lib/api/config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token) => {
        setAuthToken(token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        removeAuthToken();
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      checkAuth: () => {
        const { token, user } = get();

        if (token) {
          setAuthToken(token); // restore axios header on refresh
        }

        const valid = !!token && !!user;
        set({ isAuthenticated: valid });
        return valid;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
