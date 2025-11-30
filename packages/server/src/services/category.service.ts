import type { Category } from '@expense-tracker/shared';
import { ERROR_MESSAGES } from '@expense-tracker/shared';
import { getCategoriesCollection } from '../db/collections';

interface CategoryDocument extends Omit<Category, 'id'> {
  _id: string;
}

const categoryDocToCategory = (doc: CategoryDocument): Category => ({
  id: doc._id,
  userId: doc.userId,
  name: doc.name,
  isDefault: doc.isDefault,
  createdAt: doc.createdAt,
});

export const getCategories = async (userId: string): Promise<Category[]> => {
  const categoriesCol = getCategoriesCollection();
  
  const docs = await categoriesCol
    .find({ userId })
    .sort({ name: 1 })
    .toArray();
  
  return docs.map(categoryDocToCategory);
};

export const createCategory = async (
  userId: string,
  name: string
): Promise<Category> => {
  const categoriesCol = getCategoriesCollection();
  
  // Check if category already exists
  const existing = await categoriesCol.findOne({ userId, name });
  if (existing) {
    throw new Error('Category already exists');
  }
  
  const now = new Date().toISOString();
  const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  const categoryDoc: CategoryDocument = {
    _id: categoryId,
    userId,
    name,
    isDefault: false,
    createdAt: now,
  };
  
  await categoriesCol.insertOne(categoryDoc);
  return categoryDocToCategory(categoryDoc);
};

export const deleteCategory = async (
  userId: string,
  categoryId: string
): Promise<void> => {
  const categoriesCol = getCategoriesCollection();
  
  // Don't allow deleting default categories
  const category = await categoriesCol.findOne({ _id: categoryId, userId });
  if (!category) {
    throw new Error(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
  }
  
  if (category.isDefault) {
    throw new Error('Cannot delete default categories');
  }
  
  const result = await categoriesCol.deleteOne({ _id: categoryId, userId });
  
  if (result.deletedCount === 0) {
    throw new Error(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
  }
};