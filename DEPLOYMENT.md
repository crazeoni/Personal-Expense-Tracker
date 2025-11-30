Deployment Guide
Complete guide for deploying the Expense Tracker to AWS.

Prerequisites
1. AWS Account Setup
Active AWS account
AWS CLI v2 installed and configured
Appropriate IAM permissions for:
Lambda
API Gateway
S3
CloudFront
CloudFormation
IAM (for creating roles)
2. Verify AWS CLI Configuration
bash
# Configure AWS CLI
aws configure

# Verify configuration
aws sts get-caller-identity

# Should output your account ID and ARN
3. Install AWS CDK CLI
bash
# Install CDK globally
npm install -g aws-cdk

# Verify installation
cdk --version
4. Bootstrap CDK (First Time Only)
bash
# Bootstrap your AWS account for CDK
cdk bootstrap aws://ACCOUNT-ID/REGION

# Example:
cdk bootstrap aws://123456789012/us-east-1
Deployment Steps
Step 1: Prepare Environment Variables
Create a .env file in the packages/infrastructure directory:

bash
cd packages/infrastructure
cp .env.template .env
Edit .env:

bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012
Step 2: Build All Packages
bash
# From the root directory
cd ../..
pnpm run build
Ensure all packages build successfully:

✅ shared
✅ server
✅ client
✅ infrastructure
Step 3: Deploy to Development
bash
# Deploy to development environment
pnpm run deploy:dev

# Or manually:
cd packages/infrastructure
cdk deploy --context environment=dev
Expected Output:

✅  ExpenseTrackerStack-dev

Outputs:
ExpenseTrackerStack-dev.ApiUrl = https://abc123.execute-api.us-east-1.amazonaws.com/prod/
ExpenseTrackerStack-dev.WebsiteUrl = https://d1234567890.cloudfront.net
ExpenseTrackerStack-dev.S3BucketUrl = http://expense-tracker-dev-123456789012.s3-website-us-east-1.amazonaws.com

Stack ARN:
arn:aws:cloudformation:us-east-1:123456789012:stack/ExpenseTrackerStack-dev/...
Step 4: Update Client Configuration
After deployment, update the client environment:

bash
cd packages/client
Edit .env:

bash
VITE_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod
VITE_NODE_ENV=production
Step 5: Rebuild and Redeploy Client
bash
# Rebuild with new API URL
pnpm run build

# The CDK stack automatically deploys to S3 and CloudFront
# But if you need to update manually:
cd ../infrastructure
cdk deploy --context environment=dev
Step 6: Verify Deployment
Test API Endpoint:
bash
   curl https://your-api-url/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
Visit Website:
Open the CloudFront URL in your browser
Try registering and logging in
Create an expense
Verify all features work
Production Deployment
Additional Steps for Production
Use Production Environment:
bash
   pnpm run deploy:prod
   
   # Or manually:
   cd packages/infrastructure
   cdk deploy --context environment=prod
Configure Custom Domain (Optional):
Register domain in Route 53
Request SSL certificate in ACM
Update CDK stack to use custom domain
Configure DNS records
Enable Enhanced Monitoring:
Set up CloudWatch alarms
Configure error tracking
Enable X-Ray tracing
Implement CI/CD (Recommended):
Set up GitHub Actions or AWS CodePipeline
Automate testing and deployment
Implement blue-green deployments
Environment-Specific Configurations
Development
bash
# Lower memory, shorter timeouts, verbose logging
pnpm run deploy:dev
Staging
bash
# Production-like settings for testing
cdk deploy --context environment=staging
Production
bash
# Optimized settings, monitoring enabled
pnpm run deploy:prod
Deployment Architecture
Developer → AWS CDK → CloudFormation → AWS Resources

AWS Resources Created:
├── Lambda Functions (13)
│   ├── Auth (register, login)
│   ├── Expenses (CRUD operations)
│   ├── Categories (CRUD operations)
│   ├── Reports (monthly, by-category)
│   └── Authorizer (JWT validation)
├── API Gateway
│   ├── REST API
│   ├── Routes
│   └── CORS configuration
├── S3 Bucket
│   └── Static website hosting
├── CloudFront Distribution
│   ├── CDN for global access
│   └── HTTPS enforcement
└── IAM Roles
    └── Lambda execution roles
Cost Estimation
AWS Free Tier (First 12 months)
Lambda: 1M requests + 400,000 GB-seconds/month
API Gateway: 1M requests/month
S3: 5GB storage + 20,000 GET requests
CloudFront: 50GB data transfer
Estimated Cost: $0-5/month for light usage
Beyond Free Tier
Lambda: $0.20 per 1M requests + compute time
API Gateway: $3.50 per million requests
S3: $0.023 per GB/month
CloudFront: $0.085 per GB
Estimated Cost: $5-20/month for moderate usage (1000-10000 users)
MongoDB Atlas
Free Tier: 512MB storage, 100 connections
Shared Tier: $9/month for 2GB
Estimated Cost: $0-9/month
Total Monthly Cost Estimate:

Development: $0-5/month
Small Production (<1000 users): $5-15/month
Medium Production (1000-10000 users): $15-50/month
Monitoring Deployment
CloudWatch Logs
View Lambda logs:

bash
# List log groups
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/ExpenseTrackerStack

# Tail logs for a specific function
aws logs tail /aws/lambda/ExpenseTrackerStack-dev-RegisterFunction --follow
CloudFormation Stack Status
bash
# Check stack status
aws cloudformation describe-stacks \
  --stack-name ExpenseTrackerStack-dev \
  --query 'Stacks[0].StackStatus'

# List all resources
aws cloudformation list-stack-resources \
  --stack-name ExpenseTrackerStack-dev
API Gateway Monitoring
bash
# Get API ID
aws apigateway get-rest-apis \
  --query 'items[?name==`expense-tracker-api-dev`].id' \
  --output text

# View API metrics in CloudWatch
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiName,Value=expense-tracker-api-dev \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
Troubleshooting Deployment
Issue: CDK Deploy Fails
Error: Unable to resolve AWS account

Solution:

bash
# Reconfigure AWS CLI
aws configure

# Set explicit credentials
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_DEFAULT_REGION=us-east-1

# Bootstrap CDK
cdk bootstrap
Issue: Lambda Function Errors
Error: Runtime.ImportModuleError: Cannot find module

Solution:

bash
# Ensure all dependencies are built
cd packages/server
pnpm run build

# Check dist directory exists
ls -la dist/

# Redeploy
cd ../infrastructure
cdk deploy
Issue: CORS Errors
Error: No 'Access-Control-Allow-Origin' header

Solution:

Verify API Gateway CORS configuration in CDK
Check Lambda responses include CORS headers
Clear browser cache
Test with curl to isolate client vs server issue
Issue: API Returns 401 Unauthorized
Problem: Valid JWT tokens rejected

Solution:

bash
# Verify JWT_SECRET matches between:
# 1. Lambda functions (auth handlers)
# 2. Authorizer function
# 3. Local .env file

# Update Lambda environment variables:
aws lambda update-function-configuration \
  --function-name ExpenseTrackerStack-dev-AuthorizerFunction \
  --environment Variables={JWT_SECRET=your-secret}
Issue: CloudFront Distribution Not Updating
Problem: Website shows old content

Solution:

bash
# Create invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# Or via CDK
cdk deploy --context environment=dev
Rollback Deployment
Rollback to Previous Version
bash
# List stack events
aws cloudformation describe-stack-events \
  --stack-name ExpenseTrackerStack-dev \
  --max-items 10

# Rollback if deployment failed
aws cloudformation rollback-stack \
  --stack-name ExpenseTrackerStack-dev
Complete Stack Deletion
bash
# Delete entire stack
pnpm run destroy

# Or manually:
cd packages/infrastructure
cdk destroy

# Confirm when prompted
Warning: This will delete:

All Lambda functions
API Gateway
S3 bucket and contents
CloudFront distribution
All data (irreversible)
Security Best Practices
1. Secure Secrets
Don't:

bash
# ❌ Hardcode secrets in code
const JWT_SECRET = "my-secret-key";
Do:

bash
# ✅ Use environment variables
const JWT_SECRET = process.env.JWT_SECRET;

# ✅ Or use AWS Secrets Manager
import { SecretsManager } from 'aws-sdk';
const secret = await secretsManager.getSecretValue({
  SecretId: 'expense-tracker/jwt-secret'
}).promise();
2. Enable WAF (Production)
typescript
// Add to CDK stack
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

const webAcl = new wafv2.CfnWebACL(this, 'WebAcl', {
  scope: 'REGIONAL',
  defaultAction: { allow: {} },
  rules: [
    {
      name: 'RateLimitRule',
      priority: 1,
      action: { block: {} },
      statement: {
        rateBasedStatement: {
          limit: 2000,
          aggregateKeyType: 'IP',
        },
      },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'RateLimitRule',
      },
    },
  ],
  visibilityConfig: {
    sampledRequestsEnabled: true,
    cloudWatchMetricsEnabled: true,
    metricName: 'WebAcl',
  },
});
3. Enable CloudTrail Logging
bash
aws cloudtrail create-trail \
  --name expense-tracker-trail \
  --s3-bucket-name expense-tracker-logs

aws cloudtrail start-logging \
  --name expense-tracker-trail
4. Implement Least Privilege IAM
Review Lambda execution role permissions
Remove unnecessary permissions
Use managed policies when possible
Enable MFA for AWS console access
Maintenance
Regular Tasks
Weekly:

Review CloudWatch logs for errors
Check API Gateway metrics
Monitor Lambda execution times
Monthly:

Update dependencies (pnpm update)
Review AWS costs
Backup MongoDB database
Test disaster recovery
Quarterly:

Security audit
Performance optimization
Update Node.js runtime version
Review and update documentation
Updating the Application
bash
# 1. Make code changes
# 2. Update version in package.json
# 3. Run tests
pnpm test

# 4. Build
pnpm run build

# 5. Deploy
pnpm run deploy:prod

# 6. Verify deployment
# 7. Monitor for errors
Advanced Deployment Options
Multi-Region Deployment
Deploy to multiple regions for global availability:

bash
# Deploy to us-east-1
CDK_DEFAULT_REGION=us-east-1 cdk deploy --context environment=prod

# Deploy to eu-west-1
CDK_DEFAULT_REGION=eu-west-1 cdk deploy --context environment=prod

# Set up Route 53 for global routing
Blue-Green Deployment
typescript
// Use Lambda aliases and versions
const version = fn.currentVersion;
const alias = new lambda.Alias(this, 'Alias', {
  aliasName: 'prod',
  version,
});

// Gradually shift traffic
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';
new codedeploy.LambdaDeploymentGroup(this, 'DeploymentGroup', {
  alias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
});
Support and Resources
AWS CDK Documentation: https://docs.aws.amazon.com/cdk/
AWS CLI Reference: https://docs.aws.amazon.com/cli/
Lambda Best Practices: https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html
API Gateway Documentation: https://docs.aws.amazon.com/apigateway/
Checklist
Pre-Deployment
 MongoDB Atlas cluster created
 AWS CLI configured
 CDK bootstrapped
 All packages build successfully
 Environment variables configured
 Tests passing
Deployment
 CDK deploy successful
 All Lambda functions created
 API Gateway accessible
 S3 bucket created
 CloudFront distribution active
Post-Deployment
 API endpoints responding
 Website loads correctly
 Can register new user
 Can login
 Can create expenses
 Dashboard displays correctly
 Monitoring configured
 Logs accessible
Production Checklist
 Custom domain configured
 SSL certificate installed
 WAF enabled
 CloudWatch alarms set
 Backup strategy implemented
 Disaster recovery plan documented
 Team trained on deployment process
Deployment Time Estimate:

First-time setup: 30-45 minutes
Subsequent deployments: 5-10 minutes
Rollback: 2-5 minutes
