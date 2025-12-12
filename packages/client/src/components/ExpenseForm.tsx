import { useState } from 'react';
import { X } from 'lucide-react';
// Import necessary types
import type { CreateExpenseInput, Category } from '@expense-tracker/shared'; 
import { useCreateExpense } from '../lib/hooks/useExpenses';
import { useCategories } from '../lib/hooks/useCategories';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: any /* Replace 'any' with actual ExpenseInput type if available */) => void;
}

const ExpenseForm = ({ onClose}: ExpenseFormProps) => {
  // TS2322: 'date' can be string | undefined from useCategories hook if not careful
  const [formData, setFormData] = useState<CreateExpenseInput>({
    amount: 0,
    description: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]!,
  });

  // : 'data' is the array itself, not data.items
  const { data: categories } = useCategories();
  const createExpense = useCreateExpense();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
    await createExpense.mutateAsync(formData);
    onClose();
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Add New Expense</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {/* Added optional chaining and type 'cat' explicitly */}
            {categories?.map((cat: Category) => ( 
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createExpense.isPending}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {createExpense.isPending ? 'Adding...' : 'Add Expense'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
