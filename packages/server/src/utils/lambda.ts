import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_STATUS, createSuccessResponse, createErrorResponse } from '@expense-tracker/shared';
import type { ApiResponse } from '@expense-tracker/shared';

const ALLOWED_ORIGIN = process.env.NODE_ENV === 'dev'
  ? 'http://localhost:5173'
  : 'https://d10wqb8koma6z3.cloudfront.net';


export const createResponse = (
  statusCode: number,
  body: ApiResponse<unknown>
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
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


  // Case 1: REST API Authorizer injects { userId, email }
  if (auth && (auth as any).userId) {
    return (auth as any).userId;
  }

  // Case 2: HTTP API Authorizer injects { lambda: { userId, email } }
  if (auth && (auth as any).lambda && (auth as any).lambda.userId) {
    return (auth as any).lambda.userId;
  }

  console.error('Unauthorized: userId missing from context', { 
    hasAuth: !!auth,
    authKeys: auth ? Object.keys(auth) : []
  });
  
  throw new Error("Unauthorized: userId missing from request context");

  // console.error("Authorizer context received:", JSON.stringify(auth, null, 2));
  // throw new Error("Unauthorized: userId missing from request context");
};

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