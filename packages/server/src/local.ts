import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { register, login } from './handlers/auth';
import { listExpenses, createExpenseHandler, getExpense, updateExpenseHandler, deleteExpenseHandler } from './handlers/expenses';
import { listCategories, createCategoryHandler, deleteCategoryHandler } from './handlers/categories';
import { monthlyReport, categoryReport } from './handlers/reports';
import { verifyToken, extractTokenFromHeader } from './utils/auth';

const app = express();
const PORT = 3001;

// Middleware
// app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors({ origin: '*' }));
app.use(express.json());

// JWT Authentication Middleware for local development
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const payload = verifyToken(token);
    // Add user ID to request context (mimicking API Gateway authorizer)
    (req as any).userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

// Helper function to adapt Lambda handlers for Express
const adaptLambda = (handler: Function) => async (req: express.Request, res: express.Response) => {
  const event: any = {
    httpMethod: req.method,
    body: req.body ? JSON.stringify(req.body) : null,
    headers: req.headers,
    path: req.path,
    pathParameters: req.params,
    queryStringParameters: req.query,
    requestContext: {
      authorizer: {
        userId: (req as any).userId, // Add userId from auth middleware
      },
    },
  };

  try {
    const result = await handler(event, {} as any);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    console.error('Error in adapted handler:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Public routes (no authentication required)
app.post('/auth/register', adaptLambda(register));
app.post('/auth/login', adaptLambda(login));

// Protected routes (authentication required)
app.get('/expenses', authMiddleware, adaptLambda(listExpenses));
app.post('/expenses', authMiddleware, adaptLambda(createExpenseHandler));
app.get('/expenses/:id', authMiddleware, adaptLambda(getExpense));
app.put('/expenses/:id', authMiddleware, adaptLambda(updateExpenseHandler));
app.delete('/expenses/:id', authMiddleware, adaptLambda(deleteExpenseHandler));

app.get('/categories', authMiddleware, adaptLambda(listCategories));
app.post('/categories', authMiddleware, adaptLambda(createCategoryHandler));
app.delete('/categories/:id', authMiddleware, adaptLambda(deleteCategoryHandler));

app.get('/reports/monthly', authMiddleware, adaptLambda(monthlyReport));
app.get('/reports/by-category', authMiddleware, adaptLambda(categoryReport));

app.listen(PORT, () => {
  console.log(`✅ Real HTTP Server listening on http://localhost:${PORT}`);
});