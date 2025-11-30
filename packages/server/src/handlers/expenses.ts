import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createExpenseSchema, updateExpenseSchema, expenseQuerySchema, HTTP_STATUS } from '@expense-tracker/shared';
import { connectToDatabase } from '../db/client';
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } from '../services/expense.service';
import { parseBody, getUserIdFromEvent, successResponse, errorResponse, handleLambdaError } from '../utils/lambda';

export const listExpenses = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const queryParams = event.queryStringParameters || {};
    
    const parsed = expenseQuerySchema.parse({
      ...queryParams,
      page: queryParams.page ? parseInt(queryParams.page, 10) : undefined,
      pageSize: queryParams.pageSize ? parseInt(queryParams.pageSize, 10) : undefined,
      minAmount: queryParams.minAmount ? parseFloat(queryParams.minAmount) : undefined,
      maxAmount: queryParams.maxAmount ? parseFloat(queryParams.maxAmount) : undefined,
    });
    
    const result = await getExpenses(
      userId,
      {
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        category: parsed.category,
        minAmount: parsed.minAmount,
        maxAmount: parsed.maxAmount,
      },
      parsed.page,
      parsed.pageSize,
      parsed.sortBy,
      parsed.sortOrder
    );
    
    const response = successResponse(result)
    console.log('Response being returned:', JSON.stringify(response)); // ✅ Add this
    return response
    //return successResponse(result);
  } catch (error) {
    const errorResponse = handleLambdaError(error);
    console.log('Error response being returned:', JSON.stringify(errorResponse)); // ✅ Add this
    return errorResponse;
    //return handleLambdaError(error);
  }
};

export const createExpenseHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const body = parseBody(event);
    const input = createExpenseSchema.parse(body);
    
    const expense = await createExpense(userId, input);
    
    return successResponse(expense, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleLambdaError(error);
  }
};

export const getExpense = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const expenseId = event.pathParameters?.id;
    
    if (!expenseId) {
      return errorResponse('Expense ID is required');
    }
    
    const expense = await getExpenseById(userId, expenseId);
    
    if (!expense) {
      return errorResponse('Expense not found', HTTP_STATUS.NOT_FOUND);
    }
    
    return successResponse(expense);
  } catch (error) {
    return handleLambdaError(error);
  }
};

export const updateExpenseHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const expenseId = event.pathParameters?.id;
    
    if (!expenseId) {
      return errorResponse('Expense ID is required');
    }
    
    const body = parseBody(event);
    const input = updateExpenseSchema.parse(body);
    
    const expense = await updateExpense(userId, expenseId, input);
    
    return successResponse(expense);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return errorResponse(error.message, HTTP_STATUS.NOT_FOUND);
    }
    return handleLambdaError(error);
  }
};

export const deleteExpenseHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const expenseId = event.pathParameters?.id;
    
    if (!expenseId) {
      return errorResponse('Expense ID is required');
    }
    
    await deleteExpense(userId, expenseId);
    
    return successResponse({ message: 'Expense deleted successfully' }, HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return errorResponse(error.message, HTTP_STATUS.NOT_FOUND);
    }
    return handleLambdaError(error);
  }
};