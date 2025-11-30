# Personal Expense Tracker

A fullstack serverless expense tracking application built with React, TypeScript, AWS Lambda, and MongoDB.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with email/password
- **Expense Management**: 
  - Add, edit, and delete expenses
  - Track amount, description, category, and date
  - Filter by date range and category
  - Pagination and sorting
- **Category Management**:
  - 7 predefined default categories
  - Create custom categories
  - Category-based filtering
- **Reporting Dashboard**:
  - Monthly spending totals
  - Category-wise breakdown with percentages
  - Visual charts and graphs
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

## Architecture

```
┌─────────────────┐
│   CloudFront    │  (Optional CDN)
│   + S3 Bucket   │  (Static Hosting)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │
│  + Lambda       │
│  Authorizer     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ Lambda Functions│────▶│  MongoDB     │
│   (Business     │     │   Atlas      │
│    Logic)       │     └──────────────┘
└─────────────────┘
```

### Key Design Patterns

1. **Monorepo Structure**: Using pnpm workspaces for code sharing and organization
2. **Serverless Architecture**: AWS Lambda functions for cost-effective scaling
3. **JWT Authentication**: Stateless authentication with API Gateway authorizer
4. **Functional Programming**: Pure functions, immutability, and composable utilities
5. **Type Safety**: End-to-end TypeScript with shared types
6. **API-First Design**: RESTful API with clear separation of concerns

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **TanStack Query** - Server state management
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js 20+** - Runtime
- **AWS Lambda** - Serverless compute
- **API Gateway** - HTTP endpoints
- **TypeScript** - Type safety
- **MongoDB** - Database (Atlas)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Zod** - Schema validation

### Infrastructure
- **AWS CDK** - Infrastructure as Code
- **CloudFormation** - AWS resource provisioning
- **S3** - Static website hosting
- **CloudFront** - CDN (optional)

### Development Tools
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **tsx** - TypeScript execution

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.0.0 or higher
  ```bash
  node --version  # Should be >= v20.0.0
  ```

- **pnpm**: v8.0.0 or higher
  ```bash
  npm install -g pnpm
  pnpm --version  # Should be >= 8.0.0
  ```

- **AWS CLI**: v2.x (for deployment)
  ```bash
  aws --version
  ```

- **AWS Account**: With appropriate permissions for:
  - Lambda
  - API Gateway
  - S3
  - CloudFormation
  - IAM

- **MongoDB Atlas Account**: Free tier is sufficient
  - Sign up at https://www.mongodb.com/cloud/atlas

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all packages in the monorepo.

### 3. Set Up MongoDB Atlas

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (M0 Free tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string (looks like `mongodb+srv://...`)

### 4. Configure Environment Variables

#### Root Environment (Optional)

Copy `.env.template` to `.env`:
```bash
cp .env.template .env
```

Edit `.env`:
```bash
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=your-aws-account-id
NODE_ENV=development
```

#### Server Environment (Required)

```bash
cd packages/server
cp .env.template .env
```

Edit `packages/server/.env`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Important**: Use a strong, random JWT_SECRET (minimum 32 characters)

#### Client Environment (Required)

```bash
cd packages/client
cp .env.template .env
```

Edit `packages/client/.env`:
```bash
VITE_API_URL=http://localhost:3001
VITE_NODE_ENV=development
```

### 5. Build the Project

```bash
pnpm run build
```

This builds all packages in the correct order:
1. `shared` - Shared types and utilities
2. `server` - Backend Lambda functions
3. `client` - Frontend React application

### 6. Verify Type Checking

```bash
pnpm run type-check
```

All packages should pass without errors.

### 7. Run Linting

```bash
pnpm run lint
```

Fix any linting issues:
```bash
pnpm run lint:fix
```

## 💻 Local Development

### Start the Frontend

```bash
pnpm run dev
```

The app will be available at http://localhost:5173

### Start the Backend (Local Development Server)

In a separate terminal:

```bash
pnpm run dev:server
```

The API will be available at http://localhost:3001

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch
```

### Development Workflow

1. Make code changes
2. Run `pnpm run type-check` to verify types
3. Run `pnpm run lint:fix` to auto-fix linting issues
4. Run `pnpm test` to verify tests pass
5. Commit your changes

## Deployment

### Configure AWS Credentials

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, and default region.

### Deploy Infrastructure and Backend

```bash
# Deploy to development
pnpm run deploy:dev

# Deploy to production
pnpm run deploy:prod
```

This will:
1. Create/update Lambda functions
2. Create/update API Gateway
3. Set up Lambda authorizer
4. Configure CORS
5. Output the API Gateway URL

### Update Client Environment for Production

After deployment, update `packages/client/.env`:

```bash
VITE_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
VITE_NODE_ENV=production
```

### Build and Deploy Frontend

```bash
# Build the client
cd packages/client
pnpm run build

# Deploy to S3 (manual)
aws s3 sync dist/ s3://your-bucket-name --delete

# Or use the CDK stack to automate this
```

### Verify Deployment

1. Navigate to your deployed frontend URL
2. Try registering a new account
3. Add some expenses
4. Verify filtering and reporting work

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc..."
    }
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Expense Endpoints (Protected)

All expense endpoints require the `Authorization: Bearer <token>` header.

#### List Expenses
```http
GET /expenses?page=1&pageSize=20&category=Food&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### Create Expense
```http
POST /expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.00,
  "description": "Lunch at restaurant",
  "category": "Food",
  "date": "2024-01-15"
}
```

#### Update Expense
```http
PUT /expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 55.00,
  "description": "Lunch at restaurant (updated)"
}
```

#### Delete Expense
```http
DELETE /expenses/:id
Authorization: Bearer <token>
```

### Category Endpoints (Protected)

#### List Categories
```http
GET /categories
Authorization: Bearer <token>
```

#### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Gym"
}
```

#### Delete Category
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

### Report Endpoints (Protected)

#### Monthly Report
```http
GET /reports/monthly?month=2024-01
Authorization: Bearer <token>
```

#### Category Report
```http
GET /reports/by-category?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

## Project Structure

```
expense-tracker/
├── packages/
│   ├── shared/                 # Shared types, utilities, validation
│   │   ├── src/
│   │   │   ├── types.ts       # TypeScript interfaces
│   │   │   ├── validation.ts  # Zod schemas
│   │   │   ├── constants.ts   # Shared constants
│   │   │   ├── utils.ts       # Utility functions
│   │   │   └── index.ts       # Public exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── server/                 # Backend Lambda functions
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── env.ts     # Environment configuration
│   │   │   ├── db/
│   │   │   │   ├── client.ts  # MongoDB connection
│   │   │   │   └── collections.ts
│   │   │   ├── handlers/      # Lambda handlers
│   │   │   │   ├── auth.ts
│   │   │   │   ├── expenses.ts
│   │   │   │   ├── categories.ts
│   │   │   │   ├── reports.ts
│   │   │   │   └── authorizer.ts
│   │   │   ├── services/      # Business logic
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── expense.service.ts
│   │   │   │   ├── category.service.ts
│   │   │   │   └── report.service.ts
│   │   │   └── utils/
│   │   │       ├── auth.ts    # JWT utilities
│   │   │       └── lambda.ts  # Lambda helpers
│   │   ├── .env.template
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── client/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── lib/
│   │   │   │   ├── api/       # API client
│   │   │   │   └── hooks/     # Custom hooks
│   │   │   ├── store/         # Zustand stores
│   │   │   ├── App.tsx        # Root component
│   │   │   ├── main.tsx       # Entry point
│   │   │   └── index.css      # Global styles
│   │   ├── public/
│   │   ├── index.html
│   │   ├── .env.template
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   │
│   └── infrastructure/         # AWS CDK
│       ├── src/
│       │   ├── stacks/
│       │   └── bin/
│       ├── cdk.json
│       ├── package.json
│       └── tsconfig.json
│
├── .env.template
├── .eslintrc.json
├── .gitignore
├── package.json               # Root package.json with scripts
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── tsconfig.json              # Root TypeScript config
└── README.md                  # This file
```

## Design Decisions

### 1. Monorepo with pnpm Workspaces

**Why**: Share code between frontend and backend, maintain consistency, simplify dependency management.

**Benefits**:
- Single `pnpm install` for entire project
- Shared types prevent API contract mismatches
- Atomic commits across packages
- Consistent tooling and configuration

### 2. Serverless Architecture (AWS Lambda)

**Why**: Cost-effective, auto-scaling, pay-per-use pricing.

**Benefits**:
- Zero server management
- Automatic scaling
- Cost-effective for variable workloads
- Built-in high availability

### 3. MongoDB Atlas

**Why**: Flexible schema, generous free tier, managed service.

**Benefits**:
- Free tier sufficient for development and small production workloads
- Flexible document model for evolving requirements
- Built-in replication and backups
- Easy integration with serverless

### 4. JWT Authentication

**Why**: Stateless, scalable, works well with serverless.

**Benefits**:
- No session storage required
- Works across distributed systems
- Client-side token storage
- Easy to implement refresh tokens later

### 5. Functional Programming Approach

**Why**: More predictable, easier to test, better with immutability.

**Benefits**:
- Pure functions are easier to reason about
- Immutability prevents bugs
- Better composability
- Easier to parallelize

### 6. TypeScript Everywhere

**Why**: Catch errors at compile time, better IDE support, self-documenting code.

**Benefits**:
- Type safety across frontend and backend
- Refactoring confidence
- Better autocomplete and IntelliSense
- Living documentation

### 7. Tailwind CSS

**Why**: Rapid development, consistent design, small bundle size.

**Benefits**:
- No context switching between files
- Responsive design utilities
- Tree-shaking removes unused styles
- Consistent design system

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm test -- --coverage
```

### Test Structure

- **Shared Package**: Utility function tests
- **Server Package**: Service layer and handler tests
- **Client Package**: Component and hook tests

### Testing Best Practices

1. Test business logic in service files
2. Mock external dependencies (database, API calls)
3. Use meaningful test descriptions
4. Aim for high coverage on critical paths
5. Test edge cases and error handling

## Troubleshooting

### Common Issues

#### MongoDB Connection Fails

**Problem**: `MongoServerError: Authentication failed`

**Solution**:
1. Verify your MongoDB URI in `.env`
2. Check database user permissions
3. Ensure IP whitelist includes your IP
4. Test connection string in MongoDB Compass

#### JWT Token Invalid

**Problem**: `401 Unauthorized` on protected routes

**Solution**:
1. Ensure JWT_SECRET is set and consistent
2. Check token expiration time
3. Verify Authorization header format: `Bearer <token>`
4. Clear localStorage and re-login

#### Build Fails

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Clean all build artifacts
pnpm run clean

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm run build
```

#### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5173`

**Solution**:
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.ts
```

#### AWS Deployment Fails

**Problem**: `Error: Unable to resolve AWS account to use`

**Solution**:
1. Run `aws configure` and enter credentials
2. Verify AWS credentials: `aws sts get-caller-identity`
3. Check IAM permissions for Lambda, API Gateway, CloudFormation

### Getting Help

1. Check the GitHub Issues for similar problems
2. Review AWS CloudWatch Logs for Lambda errors
3. Enable verbose logging in development
4. Check MongoDB Atlas logs for database issues

## Performance Considerations

- **Lambda Cold Starts**: Keep functions warm with CloudWatch events
- **Database Indexes**: Created automatically on user queries
- **Client-Side Caching**: TanStack Query handles caching
- **Pagination**: Implemented for large expense lists
- **Bundle Size**: Vite performs automatic code splitting

## Security Considerations

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Input validation with Zod
- MongoDB injection prevention
- CORS configured properly
- HTTPS enforced in production
- Environment variables never committed

## 🎓 Learning Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT

## Author

Ozioma Isaiah

---

**Note**: This is a demonstration project for educational purposes. For production use, consider adding:
- Refresh token rotation
- Rate limiting
- Advanced monitoring
- Backup strategies
- CI/CD pipelines
- E2E testing
- Error tracking (Sentry)
- Analytics