# Testing Guide

Comprehensive testing documentation for the Expense Tracker application.

## Testing Stack

- **Unit Testing**: Vitest
- **Assertions**: Vitest assertions + TypeScript
- **Mocking**: Vitest mocks
- **Coverage**: Vitest coverage (c8)

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm test -- --coverage

# Run tests for specific package
pnpm --filter @expense-tracker/server test
pnpm --filter @expense-tracker/client test
pnpm --filter @expense-tracker/shared test
```

## Test Structure

### Shared Package Tests

Location: `packages/shared/src/__tests__/`

Test utilities and validation:
```typescript
// packages/shared/src/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, calculatePercentage, sanitizeString } from '../utils';

describe('utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should handle string input', () => {
      expect(formatDate('2024-01-15')).toBe('2024-01-15');
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(50, 200)).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });
  });

  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });
  });
});
```

### Server Package Tests

Location: `packages/server/src/__tests__/`

#### Testing Services

```typescript
// packages/server/src/__tests__/services/expense.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createExpense, getExpenses } from '../../services/expense.service';
import { getExpensesCollection } from '../../db/collections';

// Mock database
vi.mock('../../db/collections');

describe('ExpenseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createExpense', () => {
    it('should create expense with correct data', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ insertedId: 'exp_123' });
      vi.mocked(getExpensesCollection).mockReturnValue({
        insertOne: mockInsert,
      } as any);

      const expense = await createExpense('user_1', {
        amount: 50,
        description: 'Lunch',
        category: 'Food',
        date: '2024-01-15',
      });

      expect(expense.userId).toBe('user_1');
      expect(expense.amount).toBe(50);
      expect(mockInsert).toHaveBeenCalledOnce();
    });

    it('should throw error for invalid amount', async () => {
      await expect(createExpense('user_1', {
        amount: -10,
        description: 'Invalid',
        category: 'Food',
        date: '2024-01-15',
      })).rejects.toThrow();
    });
  });

  describe('getExpenses', () => {
    it('should return paginated expenses', async () => {
      const mockExpenses = [
        { _id: 'exp_1', amount: 50, description: 'Lunch' },
        { _id: 'exp_2', amount: 30, description: 'Coffee' },
      ];

      const mockFind = vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        toArray: vi.fn().mockResolvedValue(mockExpenses),
      });

      const mockCount = vi.fn().mockResolvedValue(2);

      vi.mocked(getExpensesCollection).mockReturnValue({
        find: mockFind,
        countDocuments: mockCount,
      } as any);

      const result = await getExpenses('user_1', {}, 1, 10);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });
  });
});
```

#### Testing Lambda Handlers

```typescript
// packages/server/src/__tests__/handlers/expenses.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createExpenseHandler } from '../../handlers/expenses';
import type { APIGatewayProxyEvent } from 'aws-lambda';

vi.mock('../../db/client');
vi.mock('../../services/expense.service');

describe('ExpenseHandlers', () => {
  const mockEvent: Partial<APIGatewayProxyEvent> = {
    body: JSON.stringify({
      amount: 50,
      description: 'Lunch',
      category: 'Food',
      date: '2024-01-15',
    }),
    requestContext: {
      authorizer: {
        userId: 'user_1',
      },
    } as any,
  };

  it('should create expense successfully', async () => {
    const result = await createExpenseHandler(mockEvent as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
  });

  it('should return 400 for invalid input', async () => {
    const invalidEvent = {
      ...mockEvent,
      body: JSON.stringify({ amount: -10 }),
    };

    const result = await createExpenseHandler(invalidEvent as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
  });
});
```

### Client Package Tests

Location: `packages/client/src/__tests__/`

#### Testing Components

```typescript
// packages/client/src/__tests__/components/ExpenseForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpenseForm from '../../components/ExpenseForm';

describe('ExpenseForm', () => {
  it('should render form fields', () => {
    render(<ExpenseForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    const onSubmit = vi.fn();
    render(<ExpenseForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Lunch' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        amount: 50,
        description: 'Lunch',
        category: expect.any(String),
        date: expect.any(String),
      });
    });
  });

  it('should show validation errors', async () => {
    render(<ExpenseForm onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    });
  });
});
```

#### Testing Hooks

```typescript
// packages/client/src/__tests__/hooks/useExpenses.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExpenses } from '../../lib/hooks/useExpenses';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useExpenses', () => {
  it('should fetch expenses', async () => {
    const { result } = renderHook(() => useExpenses(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.expenses).toBeDefined();
  });
});
```

#### Testing Store

```typescript
// packages/client/src/__tests__/store/authStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  });

  it('should login user', () => {
    const { login } = useAuthStore.getState();
    
    login(
      { id: 'user_1', email: 'test@example.com' },
      'token123'
    );

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('test@example.com');
  });

  it('should logout user', () => {
    const { login, logout } = useAuthStore.getState();
    
    login(
      { id: 'user_1', email: 'test@example.com' },
      'token123'
    );
    logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
```

## E2E Testing (Manual)

### Test Scenarios

#### Authentication Flow
1. Register new user
   - Email: `test@example.com`
   - Password: `Test123456!`
   - ✅ Should create account
   - ✅ Should receive JWT token
   - ✅ Should redirect to dashboard

2. Login with existing user
   - Email: `test@example.com`
   - Password: `Test123456!`
   - ✅ Should login successfully
   - ✅ Should redirect to dashboard

3. Invalid credentials
   - Email: `test@example.com`
   - Password: `wrong`
   - ✅ Should show error message
   - ✅ Should not login

#### Expense Management
1. Create expense
   - Amount: 50.00
   - Description: "Lunch at restaurant"
   - Category: Food
   - Date: Today
   - ✅ Should appear in list
   - ✅ Should update totals

2. Edit expense
   - Update amount to 55.00
   - ✅ Should save changes
   - ✅ Should update totals

3. Delete expense
   - ✅ Should remove from list
   - ✅ Should update totals

4. Filter expenses
   - By date range
   - ✅ Should show only expenses in range
   - By category
   - ✅ Should show only expenses in category

#### Category Management
1. View default categories
   - ✅ Should show 7 default categories

2. Create custom category
   - Name: "Gym"
   - ✅ Should add to list
   - ✅ Should be available in expense form

3. Delete custom category
   - ✅ Should remove from list
   - ✅ Should not affect expenses

#### Reporting
1. Monthly report
   - ✅ Should show correct total
   - ✅ Should list all expenses for month

2. Category report
   - ✅ Should show breakdown by category
   - ✅ Should show percentages
   - ✅ Should display chart

## Test Coverage Goals

### Minimum Coverage
- Shared utilities: 90%
- Server services: 85%
- Server handlers: 75%
- Client utilities: 85%
- Client components: 70%

### Current Coverage

```bash
# Generate coverage report
pnpm test -- --coverage

# View coverage report
open coverage/index.html
```

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Type check
        run: pnpm run type-check
      
      - name: Lint
        run: pnpm run lint
      
      - name: Test
        run: pnpm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Performance Testing

### Load Testing API

```bash
# Install artillery
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: "https://your-api-url.com"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Create expense"
    flow:
      - post:
          url: "/expenses"
          headers:
            Authorization: "Bearer {{token}}"
          json:
            amount: 50
            description: "Test"
            category: "Food"
            date: "2024-01-15"
EOF

# Run load test
artillery run load-test.yml
```

## Security Testing

### 1. SQL Injection Testing
```bash
# Test with malicious input
curl -X POST https://your-api/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "'; DROP TABLE expenses; --",
    "amount": 50,
    "category": "Food",
    "date": "2024-01-15"
  }'

# ✅ Should sanitize and reject
```

### 2. XSS Testing
```bash
# Test with script tags
curl -X POST https://your-api/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "<script>alert(\"xss\")</script>",
    "amount": 50,
    "category": "Food",
    "date": "2024-01-15"
  }'

# ✅ Should sanitize and escape
```

### 3. Authentication Testing
```bash
# Test without token
curl https://your-api/expenses

# ✅ Should return 401 Unauthorized

# Test with invalid token
curl https://your-api/expenses \
  -H "Authorization: Bearer invalid-token"

# ✅ Should return 401 Unauthorized

# Test with expired token
curl https://your-api/expenses \
  -H "Authorization: Bearer $EXPIRED_TOKEN"

# ✅ Should return 401 Unauthorized
```

## Accessibility Testing

### Automated Testing

```typescript
// packages/client/src/__tests__/a11y.test.tsx
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Testing Checklist
- [ ] Can navigate with keyboard only
- [ ] Screen reader announces correctly
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Form labels associated correctly
- [ ] Error messages announced

## Best Practices

### 1. Test Organization
```typescript
describe('Feature', () => {
  describe('SubFeature', () => {
    it('should do something specific', () => {
      // Arrange
      const input = {...};
      
      // Act
      const result = doSomething(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### 2. Mocking
- Mock external dependencies
- Use real implementations when possible
- Clear mocks between tests
- Verify mock calls

### 3. Async Testing
```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBe(expected);
});

// With waitFor
await waitFor(() => {
  expect(screen.getByText(/loaded/i)).toBeInTheDocument();
});
```

### 4. Test Data
```typescript
// Create test fixtures
const createTestExpense = (overrides = {}) => ({
  id: 'exp_1',
  amount: 50,
  description: 'Test',
  category: 'Food',
  date: '2024-01-15',
  ...overrides,
});

// Use in tests
const expense = createTestExpense({ amount: 100 });
```

## Debugging Tests

```bash
# Run single test file
pnpm test expenses.test.ts

# Run with debugger
node --inspect-brk ./node_modules/.bin/vitest

# Run specific test
pnpm test -t "should create expense"

# Update snapshots
pnpm test -u
```

## Pre-Deployment Testing

Before deploying to production:

1. ✅ All tests pass
2. ✅ Coverage meets minimums
3. ✅ Type check passes
4. ✅ Linting passes
5. ✅ Manual E2E testing completed
6. ✅ Performance acceptable
7. ✅ Security scan completed
8. ✅ Accessibility verified

---

**Remember**: Tests are documentation. Write tests that explain what the code should do, not just what it does.