import { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
// Import necessary types
import type { Expense, UpdateExpenseInput, Category } from '@expense-tracker/shared'; 
import { useUpdateExpense, useDeleteExpense } from '../lib/hooks/useExpenses';
import { useCategories } from '../lib/hooks/useCategories';

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    date: expense.date,
  });

  // FIXED: 'data' is the array itself, not data.items
  const { data: categories } = useCategories(); 
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const handleUpdate = async () => {
    const input: UpdateExpenseInput = {
      amount: editData.amount,
      description: editData.description,
      category: editData.category,
      date: editData.date,
    };
    await updateExpense.mutateAsync({ id: expense.id, input });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense.mutateAsync(expense.id);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            step="0.01"
            value={editData.amount}
            // FIXED: Explicitly type 'e' event handler
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditData({ ...editData, amount: parseFloat(e.target.value) })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={editData.date}
            // FIXED: Explicitly type 'e' event handler
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, date: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <input
          type="text"
          value={editData.description}
          // FIXED: Explicitly type 'e' event handler
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEditData({ ...editData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={editData.category}
          // FIXED: Explicitly type 'e' event handler (HTMLSelectElement for selects)
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditData({ ...editData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          {/* FIXED: Add optional chaining and type 'cat' explicitly */}
          {categories?.map((cat: Category) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={updateExpense.isPending}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">
            {expense.description}
          </span>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
            {expense.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{expense.date}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-gray-800">
          ${expense.amount.toFixed(2)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteExpense.isPending}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
