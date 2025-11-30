# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Browser                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    React Application (SPA)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Components  │  │  Zustand     │  │  React Query │         │
│  │  (UI Layer)  │──│  (State)     │──│  (API Cache) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                           │                                       │
│                           ▼                                       │
│                    ┌──────────────┐                             │
│                    │  API Client  │                             │
│                    └──────────────┘                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
                           │ Authorization: Bearer <JWT>
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS API Gateway                             │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ CORS Configuration │ Rate Limiting │ Request Validation    ││
│  └────────────────────────────────────────────────────────────┘│
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌─────────────────┐      ┌─────────────────┐
    │ Lambda          │      │ Lambda          │
    │ Authorizer      │      │ Functions       │
    │                 │      │                 │
    │ - Verify JWT    │      │ - Auth          │
    │ - Extract User  │      │ - Expenses      │
    │ - Return Policy │      │ - Categories    │
    └─────────────────┘      │ - Reports       │
                             └────────┬────────┘
                                      │
                                      ▼
                          ┌─────────────────────┐
                          │   MongoDB Atlas     │
                          │                     │
                          │  Collections:       │
                          │  - users            │
                          │  - expenses         │
                          │  - categories       │
                          └─────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User → Login Form → API Gateway → Auth Lambda → MongoDB
                                     ↓
                              Generate JWT
                                     ↓
                    Return User + Token → Client
                                     ↓
                              Store in localStorage
```

### 2. Protected Resource Access

```
User Action → API Request + JWT → API Gateway
                                      ↓
                              Lambda Authorizer
                                      ↓
                              Verify JWT → Allow/Deny
                                      ↓
                              Business Logic Lambda
                                      ↓
                              MongoDB Query
                                      ↓
                              Return Data → Client
```

## Package Dependencies

```
┌─────────────────────────────────────────────────┐
│                    client                        │
│  (React Frontend - No dependencies on server)   │
│                      │                           │
│                      └─────────┐                │
└────────────────────────────────┼────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────┐
│                    shared                        │
│  (Types, Validation, Constants, Utils)          │
│                      ▲                           │
└──────────────────────┼───────────────────────────┘
                       │
                       │
┌──────────────────────┼───────────────────────────┐
│                    server                        │
│  (Lambda Functions, Business Logic)             │
│                      │                           │
└──────────────────────┼───────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              infrastructure                      │
│  (AWS CDK - Infrastructure as Code)             │
└─────────────────────────────────────────────────┘
```

## Module Structure

### Shared Package
```
shared/
├── types.ts          # TypeScript interfaces
├── validation.ts     # Zod schemas for input validation
├── constants.ts      # Shared constants (categories, endpoints)
└── utils.ts          # Utility functions (date formatting, etc.)
```

**Purpose**: Ensure type safety and consistent validation between frontend and backend.

### Server Package
```
server/
├── config/
│   └── env.ts                    # Environment variable configuration
├── db/
│   ├── client.ts                 # MongoDB connection management
│   └── collections.ts            # Collection accessors and indexes
├── handlers/                     # Lambda function handlers
│   ├── auth.ts                  # Register, Login
│   ├── expenses.ts              # CRUD operations
│   ├── categories.ts            # Category management
│   ├── reports.ts               # Reporting endpoints
│   └── authorizer.ts            # JWT verification
├── services/                     # Business logic layer
│   ├── auth.service.ts
│   ├── expense.service.ts
│   ├── category.service.ts
│   └── report.service.ts
└── utils/
    ├── auth.ts                   # JWT utilities
    └──                  # Lambda response helpers
```

**Layering Principle**:
- **Handlers**: Parse requests, validate input, call services, return responses
- **Services**: Pure business logic, database operations
- **Utils**: Reusable utilities

### Client Package
```
client/
├── components/                   # React components
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── ExpenseList.tsx
│   ├── ExpenseForm.tsx
│   └── ReportCharts.tsx
├── lib/
│   ├── api/                     # API client layer
│   │   ├── client.ts           # Base HTTP client
│   │   ├── config.ts           # API configuration
│   │   ├── auth.ts             # Auth endpoints
│   │   └── expenses.ts         # Expense endpoints
│   └── hooks/                   # Custom React hooks
│       ├── useAuth.ts
│       └── useExpenses.ts
├── store/                       # Zustand state management
│   └── authStore.ts
├── App.tsx                      # Root component
└── main.tsx                     # Entry point
```

**Component Hierarchy**:
```
App
├── LoginPage (unauthenticated)
└── Dashboard (authenticated)
    ├── Header
    ├── StatsCards
    ├── ExpenseList
    │   ├── ExpenseFilters
    │   └── ExpenseItem[]
    ├── ExpenseForm (modal/inline)
    └── ReportCharts
        ├── MonthlyChart
        └── CategoryChart
```

## Code Quality Principles Applied

### 1. Minimalistic and Elegant

**Example**: Simple error response creation
```typescript
const createErrorResponse = (error: string): ApiResponse<never> => ({
  success: false,
  error,
});
```

### 2. Functional Approach

**Example**: Pure functions for data transformation
```typescript
const expenseDocToExpense = (doc: ExpenseDocument): Expense => ({
  id: doc._id,
  userId: doc.userId,
  amount: doc.amount,
  description: doc.description,
  category: doc.category,
  date: doc.date,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});
```

### 3. Immutability by Default

**Example**: All variables use `const`, data transformations create new objects
```typescript
const updateData: Record<string, unknown> = {
  ...input,  // Spread creates new object
  updatedAt: new Date().toISOString(),
};
```

### 4. Single Responsibility

**Example**: Each service handles one domain
- `auth.service.ts` - Only authentication logic
- `expense.service.ts` - Only expense CRUD
- `report.service.ts` - Only reporting/aggregation

### 5. DRY (Don't Repeat Yourself)

**Example**: Shared validation schemas
```typescript
// Define once in shared package
export const createExpenseSchema = z.object({...});

// Used in both client and server
// Client: Form validation
// Server: Request validation
```

### 6. Encapsulation and Layering

**Example**: Database access is encapsulated
```typescript
// Only db/collections.ts directly accesses database
// Services use collection accessors
const expensesCol = getExpensesCollection();
```

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Server validates and hashes password with bcrypt
3. Generate JWT with user info
4. Return token to client
5. Client stores in localStorage
6. All subsequent requests include JWT in Authorization header

### Authorization Flow
1. API Gateway receives request
2. Lambda Authorizer extracts JWT from header
3. Verify signature and expiration
4. Extract user ID from token
5. Return IAM policy (Allow/Deny)
6. API Gateway forwards request with user context

### Security Measures
- Passwords never stored in plain text
- JWT tokens have expiration
- HTTPS enforced in production
- Input validation on all endpoints
- MongoDB injection prevention via parameterized queries
- CORS configured to allow only trusted origins

## Database Schema

### Users Collection
```javascript
{
  _id: "user_123",
  email: "user@example.com",
  passwordHash: "$2a$10$...",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

**Indexes**: `email` (unique)

### Expenses Collection
```javascript
{
  _id: "exp_456",
  userId: "user_123",
  amount: 50.00,
  description: "Lunch",
  category: "Food",
  date: "2024-01-15",
  createdAt: "2024-01-15T12:00:00Z",
  updatedAt: "2024-01-15T12:00:00Z"
}
```

**Indexes**: 
- `userId`
- `userId + date` (compound, for date range queries)
- `userId + category` (compound, for category filtering)

### Categories Collection
```javascript
{
  _id: "cat_789",
  userId: "user_123",
  name: "Food",
  isDefault: true,
  createdAt: "2024-01-01T00:00:00Z"
}
```

**Indexes**: `userId + name` (compound, unique)

## Performance Considerations

### Lambda Cold Starts
- Keep functions small and focused
- Use connection pooling for MongoDB
- Consider provisioned concurrency for critical paths

### Database Performance
- Indexes on frequently queried fields
- Projection to return only needed fields
- Pagination for large result sets
- Aggregation pipeline for complex reports

### Client Performance
- React Query for automatic caching
- Lazy loading for code splitting
- Optimistic updates for better UX
- Debouncing for search/filter inputs

## Scalability Considerations

### Horizontal Scaling
- Serverless architecture scales automatically
- MongoDB Atlas auto-scales storage and throughput
- Stateless design allows unlimited Lambda instances

### Vertical Scaling
- Lambda memory can be increased per function
- MongoDB cluster can be upgraded to higher tiers
- CloudFront CDN for static assets

### Cost Optimization
- Lambda free tier: 1M requests + 400,000 GB-seconds/month
- MongoDB Atlas free tier: 512 MB storage
- API Gateway free tier: 1M requests/month
- Total cost for small apps: $0-10/month

## Monitoring and Observability

### Logging
- Lambda CloudWatch Logs for all functions
- Structured logging with consistent format
- Error tracking with stack traces

### Metrics
- Lambda invocations, duration, errors
- API Gateway request count, latency
- MongoDB connection pool, query performance

### Alerts (Production)
- Lambda error rate threshold
- API Gateway 5xx errors
- MongoDB connection failures
- High latency warnings

## Future Enhancements

### Phase 2 Features
- Budget tracking per category
- Recurring expenses
- CSV export functionality
- Multi-currency support
- Expense attachments (receipts)

### Technical Improvements
- Refresh token rotation
- Rate limiting per user
- Advanced caching strategy
- GraphQL API alternative
- Real-time updates with WebSockets
- Mobile app (React Native)

### DevOps Improvements
- CI/CD pipeline (GitHub Actions)
- Automated testing in pipeline
- Blue-green deployments
- Infrastructure testing
- Performance benchmarking