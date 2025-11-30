// packages/client/src/__tests__/components/ExpenseForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpenseForm from '../../components/ExpenseForm';

describe('ExpenseForm', () => {
  it('should render form fields', () => {
    // Add onClose={vi.fn()} here
    render(<ExpenseForm onSubmit={vi.fn()} onClose={vi.fn()} />); 

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const onSubmit = vi.fn();
    // Add onClose={vi.fn()} here
    render(<ExpenseForm onSubmit={onSubmit} onClose={vi.fn()} />); 

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Lunch' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        amount: 50,
        description: 'Lunch',
        category: expect.any(String),
        date: expect.any(String),
      });
    });
  });

  it('should show validation errors', async () => {
    // Add onClose={vi.fn()} here
    render(<ExpenseForm onSubmit={vi.fn()} onClose={vi.fn()} />); 

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    });
  });
});
