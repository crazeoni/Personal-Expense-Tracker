import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import * as path from 'path';

interface ExpenseTrackerStackProps extends cdk.StackProps {
  environment: string;
  mongodbUri: string;
  jwtSecret: string;
}

export class ExpenseTrackerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExpenseTrackerStackProps) {
    super(scope, id, props);

    const { environment, mongodbUri, jwtSecret } = props;

    // Lambda Layer for shared code
    const sharedLayer = new lambda.LayerVersion(this, 'SharedLayer', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../shared/dist')), // path to compiled shared code
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      description: 'Shared code for expense tracker lambdas',
    });


    // Lambda Layer for shared dependencies
    const dependenciesLayer = new lambda.LayerVersion(this, 'DependenciesLayer', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      description: 'Dependencies for expense tracker lambdas',
    });

    // Environment variables for all lambdas
    const lambdaEnvironment = {
      MONGODB_URI: mongodbUri,
      JWT_SECRET: jwtSecret,
      JWT_EXPIRES_IN: '7d',
      NODE_ENV: environment,
    };

    // Auth Lambda Functions
    const registerFunction = new lambda.Function(this, 'RegisterFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/auth.register',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    const loginFunction = new lambda.Function(this, 'LoginFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/auth.login',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    // Authorizer Lambda
    const authorizerFunction = new lambda.Function(this, 'AuthorizerFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/authorizer.authorizer',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(5),
      memorySize: 128,
      layers: [sharedLayer],
    });

    // Expense Lambda Functions
    const listExpensesFunction = new lambda.Function(this, 'ListExpensesFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/expenses.listExpenses',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    const createExpenseFunction = new lambda.Function(this, 'CreateExpenseFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/expenses.createExpenseHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    const getExpenseFunction = new lambda.Function(this, 'GetExpenseFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/expenses.getExpense',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    const updateExpenseFunction = new lambda.Function(this, 'UpdateExpenseFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/expenses.updateExpenseHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    const deleteExpenseFunction = new lambda.Function(this, 'DeleteExpenseFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/expenses.deleteExpenseHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    // Category Lambda Functions
    const listCategoriesFunction = new lambda.Function(this, 'ListCategoriesFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/categories.listCategories',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    const createCategoryFunction = new lambda.Function(this, 'CreateCategoryFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/categories.createCategoryHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    const deleteCategoryFunction = new lambda.Function(this, 'DeleteCategoryFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/categories.deleteCategoryHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    // Report Lambda Functions
    const monthlyReportFunction = new lambda.Function(this, 'MonthlyReportFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/reports.monthlyReport',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    const categoryReportFunction = new lambda.Function(this, 'CategoryReportFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/reports.categoryReport',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
      environment: lambdaEnvironment,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      layers: [sharedLayer],
    });

    // API Gateway
    // const api = new apigateway.RestApi(this, 'ExpenseTrackerApi', {
    //   restApiName: `expense-tracker-api-${environment}`,
    //   description: 'Expense Tracker API',
    //   defaultCorsPreflightOptions: {
    //     allowOrigins: apigateway.Cors.ALL_ORIGINS,
    //     allowMethods: apigateway.Cors.ALL_METHODS,
    //     allowHeaders: ['Content-Type', 'Authorization'],
    //     allowCredentials: true,
    //   },
    // });

    const api = new apigateway.RestApi(this, 'ExpenseTrackerApi', {
      restApiName: `expense-tracker-api-${environment}`,
      description: 'Expense Tracker API',
      defaultCorsPreflightOptions: {
        allowOrigins: environment === 'dev' 
          ? ['http://localhost:5173', 'http://localhost:3000']
          : apigateway.Cors.ALL_ORIGINS, // or specify production domains
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token'],
        allowCredentials: environment === 'dev', // Only for dev with specific origins
      },
    });


    // Add Gateway Responses to handle CORS on errors
    api.addGatewayResponse('Unauthorized', {
      type: apigateway.ResponseType.UNAUTHORIZED,
      statusCode: '401',
      responseHeaders: {
        'Access-Control-Allow-Origin': environment === 'dev' ? "'http://localhost:5173'" : "'*'",
        'Access-Control-Allow-Headers': "'Content-Type,Authorization'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS'",
      },
    });

    api.addGatewayResponse('AccessDenied', {
      type: apigateway.ResponseType.ACCESS_DENIED,
      statusCode: '403',
      responseHeaders: {
        'Access-Control-Allow-Origin': environment === 'dev' ? "'http://localhost:5173'" : "'*'",
        'Access-Control-Allow-Headers': "'Content-Type,Authorization'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS'",
      },
    });

    api.addGatewayResponse('Default4xx', {
      type: apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': environment === 'dev' ? "'http://localhost:5173'" : "'*'",
        'Access-Control-Allow-Headers': "'Content-Type,Authorization'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS'",
      },
    });

    api.addGatewayResponse('Default5xx', {
      type: apigateway.ResponseType.DEFAULT_5XX,
      responseHeaders: {
        'Access-Control-Allow-Origin': environment === 'dev' ? "'http://localhost:5173'" : "'*'",
        'Access-Control-Allow-Headers': "'Content-Type,Authorization'",
        'Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS'",
      },
    });


    
    // Lambda Authorizer
    const authorizer = new apigateway.TokenAuthorizer(this, 'JwtAuthorizer', {
      handler: authorizerFunction,
      identitySource: 'method.request.header.Authorization',
      resultsCacheTtl: cdk.Duration.minutes(5),
    });

    // Auth routes (no authorization)
    const authResource = api.root.addResource('auth');
    const registerResource = authResource.addResource('register');
    const loginResource = authResource.addResource('login');

    registerResource.addMethod('POST', new apigateway.LambdaIntegration(registerFunction));
    loginResource.addMethod('POST', new apigateway.LambdaIntegration(loginFunction));

    // Expense routes (with authorization)
    const expensesResource = api.root.addResource('expenses');
    expensesResource.addMethod('GET', new apigateway.LambdaIntegration(listExpensesFunction), {
      authorizer,
    });
    expensesResource.addMethod('POST', new apigateway.LambdaIntegration(createExpenseFunction), {
      authorizer,
    });

    const expenseResource = expensesResource.addResource('{id}');
    expenseResource.addMethod('GET', new apigateway.LambdaIntegration(getExpenseFunction), {
      authorizer,
    });
    expenseResource.addMethod('PUT', new apigateway.LambdaIntegration(updateExpenseFunction), {
      authorizer,
    });
    expenseResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteExpenseFunction), {
      authorizer,
    });

    // Category routes (with authorization)
    const categoriesResource = api.root.addResource('categories');
    categoriesResource.addMethod('GET', new apigateway.LambdaIntegration(listCategoriesFunction), {
      authorizer,
    });
    categoriesResource.addMethod('POST', new apigateway.LambdaIntegration(createCategoryFunction), {
      authorizer,
    });

    const categoryResource = categoriesResource.addResource('{id}');
    categoryResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteCategoryFunction), {
      authorizer,
    });

    // Report routes (with authorization)
    const reportsResource = api.root.addResource('reports');
    const monthlyResource = reportsResource.addResource('monthly');
    const categoryReportResource = reportsResource.addResource('by-category');

    monthlyResource.addMethod('GET', new apigateway.LambdaIntegration(monthlyReportFunction), {
      authorizer,
    });
    categoryReportResource.addMethod('GET', new apigateway.LambdaIntegration(categoryReportFunction), {
      authorizer,
    });

    // S3 Bucket for frontend
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `expense-tracker-${environment}-${this.account}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront Distribution (optional, for better performance)
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Deploy website to S3
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../../client/dist'))],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'S3BucketUrl', {
      value: websiteBucket.bucketWebsiteUrl,
      description: 'S3 Website URL',
    });
  }
}