import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createCategorySchema, HTTP_STATUS } from '@expense-tracker/shared';
import { connectToDatabase } from '../db/client';
import { getCategories, createCategory, deleteCategory } from '../services/category.service';
import { parseBody, getUserIdFromEvent, successResponse, errorResponse, handleLambdaError } from '../utils/lambda';

export const listCategories = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const categories = await getCategories(userId);
    
    return successResponse(categories);
  } catch (error) {
    return handleLambdaError(error);
  }
};

export const createCategoryHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const body = parseBody(event);
    const input = createCategorySchema.parse(body);
    
    const category = await createCategory(userId, input.name);
    
    return successResponse(category, HTTP_STATUS.CREATED);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return errorResponse(error.message, HTTP_STATUS.CONFLICT);
    }
    return handleLambdaError(error);
  }
};

export const deleteCategoryHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const categoryId = event.pathParameters?.id;
    
    if (!categoryId) {
      return errorResponse('Category ID is required');
    }
    
    await deleteCategory(userId, categoryId);
    
    return successResponse({ message: 'Category deleted successfully' }, HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    if (error instanceof Error && (error.message.includes('not found') || error.message.includes('Cannot delete'))) {
      return errorResponse(error.message, error.message.includes('not found') ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST);
    }
    return handleLambdaError(error);
  }
};