// packages/client/src/__tests__/hooks/useExpenses.test.ts

import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import React from 'react'; 
import { useExpenses } from '../../lib/hooks/useExpenses';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  // Corrected Syntax: Use explicit return with a Provider component as the value
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return Wrapper; // Return the functional component
};

describe('useExpenses', () => {
  it('should fetch expenses', async () => {
    const { result } = renderHook(() => useExpenses(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      // Optional: Check data is defined within the wait
      expect(result.current.data).toBeDefined(); 
    });

    // Access the data property of the hook's result
    expect(result.current.data).toBeDefined(); 
  });
});
