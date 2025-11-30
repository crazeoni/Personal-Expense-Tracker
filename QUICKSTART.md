Quick Start Guide
This guide will get you up and running in under 10 minutes.

Prerequisites Checklist
 Node.js 20+ installed (node --version)
 pnpm installed (npm install -g pnpm)
 MongoDB Atlas account (free tier)
 AWS CLI configured (for deployment)
Step-by-Step Setup
1. Clone and Install (2 minutes)
bash
# Clone the repository
git clone <repository-url>
cd expense-tracker

# Install all dependencies
pnpm install
2. MongoDB Setup (3 minutes)
Go to MongoDB Atlas
Create a free cluster
Click "Connect" → "Connect your application"
Copy the connection string
Replace <password> with your database password
3. Configure Environment (2 minutes)
Server Configuration
bash
cd packages/server
cp .env.template .env
Edit .env:

bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your-secret-key-minimum-32-characters-long-random-string
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://localhost:5173
Client Configuration
bash
cd ../client
cp .env.template .env
Edit .env:

bash
VITE_API_URL=http://localhost:3001
4. Build and Run (3 minutes)
bash
# From the root directory
cd ../..

# Build all packages
pnpm run build

# Start the frontend (in terminal 1)
pnpm run dev

# Start the backend (in terminal 2)
pnpm run dev:server
5. Test the Application
Open http://localhost:5173 in your browser
Click "Sign Up" and create an account
Add your first expense
View the dashboard with charts
Verification Checklist
 Frontend loads at http://localhost:5173
 Backend responds at http://localhost:3001
 Can create an account
 Can login successfully
 Can add an expense
 Can view dashboard
 Charts display correctly
 Can filter expenses
 Can add custom categories
Troubleshooting
MongoDB Connection Error
Error: MongoServerError: Authentication failed

Fix:

bash
# 1. Verify connection string in packages/server/.env
# 2. Check MongoDB Atlas IP whitelist (use 0.0.0.0/0 for development)
# 3. Ensure password is URL-encoded if it contains special characters
Port Already in Use
Error: EADDRINUSE: address already in use

Fix:

bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or kill process on port 3001
lsof -ti:3001 | xargs kill -9
Build Errors
Error: TypeScript compilation errors

Fix:

bash
# Clean and rebuild
pnpm run clean
rm -rf node_modules
pnpm install
pnpm run build
AWS Deployment (Optional)
Prerequisites
AWS account with CLI configured
AWS credentials with Lambda/API Gateway permissions
Deploy
bash
# Install AWS CDK globally (first time only)
npm install -g aws-cdk

# Configure AWS credentials
aws configure

# Deploy infrastructure
pnpm run deploy:dev
After deployment:

Note the API Gateway URL from the output
Update packages/client/.env:
bash
   VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/dev
Rebuild and deploy frontend:
bash
   cd packages/client
   pnpm run build
   # Upload dist/ to S3 or your hosting provider
Common Commands
bash
# Development
pnpm run dev              # Start frontend dev server
pnpm run dev:server       # Start backend dev server

# Building
pnpm run build           # Build all packages
pnpm run build:client    # Build frontend only
pnpm run build:server    # Build backend only

# Code Quality
pnpm run type-check      # Check TypeScript types
pnpm run lint            # Run ESLint
pnpm run lint:fix        # Fix ESLint issues
pnpm test                # Run tests

# Deployment
pnpm run deploy:dev      # Deploy to AWS dev environment
pnpm run deploy:prod     # Deploy to AWS production
pnpm run destroy         # Destroy AWS resources

# Cleaning
pnpm run clean           # Clean all build artifacts
Project Structure Quick Reference
expense-tracker/
├── packages/
│   ├── shared/          # Types, validation, constants
│   ├── server/          # Lambda functions, API
│   ├── client/          # React frontend
│   └── infrastructure/  # AWS CDK deployment
├── package.json         # Root package with scripts
├── pnpm-workspace.yaml  # Workspace config
└── README.md            # Full documentation
Key Files to Review
Backend Logic
packages/server/src/handlers/ - Lambda function handlers
packages/server/src/services/ - Business logic
packages/shared/src/validation.ts - Input validation schemas
Frontend
packages/client/src/App.tsx - Main app component
packages/client/src/lib/api/ - API client
packages/client/src/store/ - State management
Configuration
packages/server/.env - Backend environment variables
packages/client/.env - Frontend environment variables
packages/infrastructure/src/ - AWS infrastructure code
Testing the Implementation
Manual Testing Checklist
Authentication

 Register new user
 Login with correct credentials
 Login fails with wrong password
 Logout works
 Token persists on page refresh
Expense Management

 Create expense
 Edit expense
 Delete expense
 Filter by date range
 Filter by category
 Pagination works with many expenses
Categories

 Default categories are created on signup
 Can create custom category
 Can delete custom category
 Cannot delete default categories
Reporting

 Monthly total shows correct amount
 Category breakdown shows all categories
 Charts display correctly
 Percentages add up to 100%
Performance Benchmarks
Expected performance for a fresh deployment:

Initial Load: < 2 seconds
API Response Time: 100-300ms (cold start), < 50ms (warm)
Database Query Time: < 50ms
Frontend Interaction: < 100ms
Getting Help
Check the README.md - Full documentation
Check ARCHITECTURE.md - Technical details
Check AWS CloudWatch Logs - Lambda errors
Check MongoDB Atlas Logs - Database issues
Check Browser Console - Frontend errors
Next Steps
Once you have the app running:

Read the full README.md for detailed documentation
Review ARCHITECTURE.md for system design
Explore the code starting from packages/client/src/App.tsx
Try deploying to AWS with pnpm run deploy:dev
Customize the app for your needs
Success Criteria
You've successfully set up the application when:

✅ You can register and login
✅ You can create, edit, and delete expenses
✅ Dashboard shows your expenses with charts
✅ Filters work correctly
✅ No errors in browser console
✅ No errors in server logs

Congratulations! Your Personal Expense Tracker is now running. 🎉

Estimated Setup Time: 10 minutes
Difficulty: Beginner-Intermediate
Support: Check GitHub Issues or README.md

