import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCategories, useCreateCategory, useDeleteCategory } from '../lib/hooks/useCategories';
// Import the Category interface if it's available from shared or local types
import type { Category } from '@expense-tracker/shared'; 

interface CategoryListProps {
  isLoading: boolean;
}

const CategoryList = ({ isLoading }: CategoryListProps) => {
  const [newCategory, setNewCategory] = useState('');
  
  // Use data instead of categories directly from the hook result
  const { data } = useCategories(); 
  const categories = data; // Get the items array if data exists

  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      await createCategory.mutateAsync({ name: newCategory.trim() });
      setNewCategory('');
    }
  };

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      alert('Cannot delete default categories');
      return;
    }
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory.mutateAsync(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Manage Categories</h3>

      <form onSubmit={handleCreate} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)} // Explicit type 'e'
            placeholder="New category"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={createCategory.isPending || !newCategory.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center text-gray-500 text-sm">Loading...</div>
      ) : (
        <div className="space-y-2">
          {categories?.map((cat: Category) => ( // Explicitly type 'cat'
            <div
              key={cat.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-700">{cat.name}</span>
              {!cat.isDefault && (
                <button
                  onClick={() => handleDelete(cat.id, cat.isDefault)}
                  disabled={deleteCategory.isPending}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
