"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseTrackerStack = void 0;
var cdk = require("aws-cdk-lib");
var lambda = require("aws-cdk-lib/aws-lambda");
var apigateway = require("aws-cdk-lib/aws-apigateway");
var s3 = require("aws-cdk-lib/aws-s3");
var s3deploy = require("aws-cdk-lib/aws-s3-deployment");
var cloudfront = require("aws-cdk-lib/aws-cloudfront");
var origins = require("aws-cdk-lib/aws-cloudfront-origins");
var path = require("path");
var ExpenseTrackerStack = /** @class */ (function (_super) {
    __extends(ExpenseTrackerStack, _super);
    function ExpenseTrackerStack(scope, id, props) {
        var _this = _super.call(this, scope, id, props) || this;
        var environment = props.environment, mongodbUri = props.mongodbUri, jwtSecret = props.jwtSecret;
        // Lambda Layer for shared dependencies
        var dependenciesLayer = new lambda.LayerVersion(_this, 'DependenciesLayer', {
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
            description: 'Dependencies for expense tracker lambdas',
        });
        // Environment variables for all lambdas
        var lambdaEnvironment = {
            MONGODB_URI: mongodbUri,
            JWT_SECRET: jwtSecret,
            JWT_EXPIRES_IN: '7d',
            NODE_ENV: environment,
        };
        // Auth Lambda Functions
        var registerFunction = new lambda.Function(_this, 'RegisterFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/auth.register',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        var loginFunction = new lambda.Function(_this, 'LoginFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/auth.login',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        // Authorizer Lambda
        var authorizerFunction = new lambda.Function(_this, 'AuthorizerFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/authorizer.authorizer',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: { JWT_SECRET: jwtSecret },
            timeout: cdk.Duration.seconds(5),
            memorySize: 128,
        });
        // Expense Lambda Functions
        var listExpensesFunction = new lambda.Function(_this, 'ListExpensesFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/expenses.listExpenses',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        var createExpenseFunction = new lambda.Function(_this, 'CreateExpenseFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/expenses.createExpenseHandler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        var getExpenseFunction = new lambda.Function(_this, 'GetExpenseFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/expenses.getExpense',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        var updateExpenseFunction = new lambda.Function(_this, 'UpdateExpenseFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/expenses.updateExpenseHandler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        var deleteExpenseFunction = new lambda.Function(_this, 'DeleteExpenseFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/expenses.deleteExpenseHandler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        // Category Lambda Functions
        var listCategoriesFunction = new lambda.Function(_this, 'ListCategoriesFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/categories.listCategories',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        var createCategoryFunction = new lambda.Function(_this, 'CreateCategoryFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/categories.createCategoryHandler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        var deleteCategoryFunction = new lambda.Function(_this, 'DeleteCategoryFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/categories.deleteCategoryHandler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        // Report Lambda Functions
        var monthlyReportFunction = new lambda.Function(_this, 'MonthlyReportFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/reports.monthlyReport',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        var categoryReportFunction = new lambda.Function(_this, 'CategoryReportFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'handlers/reports.categoryReport',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../server/dist')),
            environment: lambdaEnvironment,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });
        // API Gateway
        var api = new apigateway.RestApi(_this, 'ExpenseTrackerApi', {
            restApiName: "expense-tracker-api-".concat(environment),
            description: 'Expense Tracker API',
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: ['Content-Type', 'Authorization'],
            },
        });
        // Lambda Authorizer
        var authorizer = new apigateway.TokenAuthorizer(_this, 'JwtAuthorizer', {
            handler: authorizerFunction,
            identitySource: 'method.request.header.Authorization',
            resultsCacheTtl: cdk.Duration.minutes(5),
        });
        // Auth routes (no authorization)
        var authResource = api.root.addResource('auth');
        var registerResource = authResource.addResource('register');
        var loginResource = authResource.addResource('login');
        registerResource.addMethod('POST', new apigateway.LambdaIntegration(registerFunction));
        loginResource.addMethod('POST', new apigateway.LambdaIntegration(loginFunction));
        // Expense routes (with authorization)
        var expensesResource = api.root.addResource('expenses');
        expensesResource.addMethod('GET', new apigateway.LambdaIntegration(listExpensesFunction), {
            authorizer: authorizer,
        });
        expensesResource.addMethod('POST', new apigateway.LambdaIntegration(createExpenseFunction), {
            authorizer: authorizer,
        });
        var expenseResource = expensesResource.addResource('{id}');
        expenseResource.addMethod('GET', new apigateway.LambdaIntegration(getExpenseFunction), {
            authorizer: authorizer,
        });
        expenseResource.addMethod('PUT', new apigateway.LambdaIntegration(updateExpenseFunction), {
            authorizer: authorizer,
        });
        expenseResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteExpenseFunction), {
            authorizer: authorizer,
        });
        // Category routes (with authorization)
        var categoriesResource = api.root.addResource('categories');
        categoriesResource.addMethod('GET', new apigateway.LambdaIntegration(listCategoriesFunction), {
            authorizer: authorizer,
        });
        categoriesResource.addMethod('POST', new apigateway.LambdaIntegration(createCategoryFunction), {
            authorizer: authorizer,
        });
        var categoryResource = categoriesResource.addResource('{id}');
        categoryResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteCategoryFunction), {
            authorizer: authorizer,
        });
        // Report routes (with authorization)
        var reportsResource = api.root.addResource('reports');
        var monthlyResource = reportsResource.addResource('monthly');
        var categoryReportResource = reportsResource.addResource('by-category');
        monthlyResource.addMethod('GET', new apigateway.LambdaIntegration(monthlyReportFunction), {
            authorizer: authorizer,
        });
        categoryReportResource.addMethod('GET', new apigateway.LambdaIntegration(categoryReportFunction), {
            authorizer: authorizer,
        });
        // S3 Bucket for frontend
        var websiteBucket = new s3.Bucket(_this, 'WebsiteBucket', {
            bucketName: "expense-tracker-".concat(environment, "-").concat(_this.account),
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
        var distribution = new cloudfront.Distribution(_this, 'Distribution', {
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
        new s3deploy.BucketDeployment(_this, 'DeployWebsite', {
            sources: [s3deploy.Source.asset(path.join(__dirname, '../../../client/dist'))],
            destinationBucket: websiteBucket,
            distribution: distribution,
            distributionPaths: ['/*'],
        });
        // Outputs
        new cdk.CfnOutput(_this, 'ApiUrl', {
            value: api.url,
            description: 'API Gateway URL',
        });
        new cdk.CfnOutput(_this, 'WebsiteUrl', {
            value: "https://".concat(distribution.distributionDomainName),
            description: 'CloudFront Distribution URL',
        });
        new cdk.CfnOutput(_this, 'S3BucketUrl', {
            value: websiteBucket.bucketWebsiteUrl,
            description: 'S3 Website URL',
        });
        return _this;
    }
    return ExpenseTrackerStack;
}(cdk.Stack));
exports.ExpenseTrackerStack = ExpenseTrackerStack;
