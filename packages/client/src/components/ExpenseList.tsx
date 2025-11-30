import { PlusCircle } from 'lucide-react';
import ExpenseItem from './ExpenseItem';
import { useExpenses } from '../lib/hooks/useExpenses';
// Import necessary types
import type { Expense } from '@expense-tracker/shared'; 

interface ExpenseListProps {
  onAddExpense: () => void;
  isLoading: boolean;
}

const ExpenseList = ({ onAddExpense, isLoading }: ExpenseListProps) => {
  // FIXED: Destructure 'data' from the hook result
  const { data } = useExpenses();
  // Access the items array from the data, using optional chaining
  const expenses = data?.items;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Expenses</h2>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading expenses...</div>
      ) : expenses && expenses.length > 0 ? ( // Check if expenses array exists and has length
        <div className="space-y-3">
          {/* FIXED: Type the map callback parameter explicitly as Expense */}
          {expenses.map((expense: Expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No expenses found. Add your first expense!
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
