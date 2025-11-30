import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { registerSchema, loginSchema, HTTP_STATUS } from '@expense-tracker/shared';
import { connectToDatabase } from '../db/client';
import { registerUser, loginUser } from '../services/auth.service';
import { parseBody, successResponse, errorResponse, handleLambdaError } from '../utils/lambda';

export const register = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const body = parseBody(event);
    const input = registerSchema.parse(body);
    
    const result = await registerUser(input.email, input.password);
    
    return successResponse(result, HTTP_STATUS.CREATED);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return errorResponse(error.message, HTTP_STATUS.CONFLICT);
    }
    return handleLambdaError(error);
  }
};

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const body = parseBody(event);
    const input = loginSchema.parse(body);
    
    const result = await loginUser(input.email, input.password);
    
    return successResponse(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid')) {
      return errorResponse(error.message, HTTP_STATUS.UNAUTHORIZED);
    }
    return handleLambdaError(error);
  }
};