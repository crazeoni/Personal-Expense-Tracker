// packages/client/src/__tests__/store/authStore.test.ts
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { useAuthStore } from '../../store/authStore';
import type { User } from '@expense-tracker/shared'; // Import the User type

beforeAll(() => {
  // Simple mock for localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })();

  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

afterAll(() => {
  // Clean up if needed
  (global as any).localStorage = undefined;
});

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  });

  it('should login user', () => {
    const { login } = useAuthStore.getState();
    
    // Create a complete User object
    const mockUser: User = {
      id: 'user_1',
      email: 'test@example.com',
      createdAt: new Date().toISOString(), // Add these missing properties
      updatedAt: new Date().toISOString(), // Add these missing properties
    };

    login(
      mockUser, // Pass the complete object
      'token123'
    );

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('test@example.com');
  });

  it('should logout user', () => {
    const { login, logout } = useAuthStore.getState();
    
    const mockUser: User = { // Also update the user object here
      id: 'user_1',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    login(
      mockUser,
      'token123'
    );
    logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
