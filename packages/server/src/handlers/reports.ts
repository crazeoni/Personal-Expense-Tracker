import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getCurrentMonth } from '@expense-tracker/shared';
import { connectToDatabase } from '../db/client';
import { getMonthlyReport, getCategoryReport } from '../services/report.service';
import { getUserIdFromEvent, successResponse, handleLambdaError } from '../utils/lambda';

export const monthlyReport = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const month = event.queryStringParameters?.month || getCurrentMonth();
    
    const report = await getMonthlyReport(userId, month);
    
    return successResponse(report);
  } catch (error) {
    return handleLambdaError(error);
  }
};

export const categoryReport = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromEvent(event);
    const { startDate, endDate } = event.queryStringParameters || {};
    
    const report = await getCategoryReport(userId, startDate, endDate);
    
    return successResponse(report);
  } catch (error) {
    return handleLambdaError(error);
  }
};