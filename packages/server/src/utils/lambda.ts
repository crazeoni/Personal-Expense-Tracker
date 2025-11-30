import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_STATUS, createSuccessResponse, createErrorResponse } from '@expense-tracker/shared';
import type { ApiResponse } from '@expense-tracker/shared';

export const createResponse = (
  statusCode: number,
  body: ApiResponse<unknown>
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Credentials': 'false',
  },
  body: JSON.stringify(body),
});

export const parseBody = <T>(event: APIGatewayProxyEvent): T => {
  if (!event.body) {
    throw new Error('Request body is required');
  }
  
  try {
    return JSON.parse(event.body) as T;
  } catch {
    throw new Error('Invalid JSON in request body');
  }
};

export const getUserIdFromEvent = (event: APIGatewayProxyEvent): string => {
  const auth = event.requestContext?.authorizer;

  console.log('Full requestContext:', JSON.stringify(event.requestContext, null, 2));
  console.log('Authorizer context received:', JSON.stringify(auth, null, 2));

  // Case 1: REST API Authorizer injects { userId, email }
  if (auth && (auth as any).userId) {
    console.log('Found userId in REST API format:', (auth as any).userId);
    return (auth as any).userId;
  }

  // Case 2: HTTP API Authorizer injects { lambda: { userId, email } }
  if (auth && (auth as any).lambda && (auth as any).lambda.userId) {
    console.log('Found userId in HTTP API format:', (auth as any).lambda.userId);
    return (auth as any).lambda.userId;
  }

  console.error("Authorizer context received:", JSON.stringify(auth, null, 2));
  throw new Error("Unauthorized: userId missing from request context");
};


// export const getUserIdFromEvent = (event: APIGatewayProxyEvent): string => {
//   const userId = event.requestContext.authorizer?.userId;
  
//   if (!userId) {
//     throw new Error('User ID not found in request context');
//   }
  
//   return userId as string;
// };

export const handleLambdaError = (error: unknown): APIGatewayProxyResult => {
  console.error('Lambda error:', error);
  
  const message = error instanceof Error ? error.message : 'Internal server error';
  
  return createResponse(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    createErrorResponse(message)
  );
};

export const successResponse = <T>(data: T, statusCode: number = HTTP_STATUS.OK): APIGatewayProxyResult => {
  return createResponse(statusCode, createSuccessResponse(data));
};

export const errorResponse = (message: string, statusCode: number = HTTP_STATUS.BAD_REQUEST): APIGatewayProxyResult => {
  return createResponse(statusCode, createErrorResponse(message));
};