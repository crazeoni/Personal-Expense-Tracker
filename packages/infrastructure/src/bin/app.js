#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
var cdk = require("aws-cdk-lib");
var ExpenseTrackerStack_1 = require("../stacks/ExpenseTrackerStack");
var app = new cdk.App();
var environment = app.node.tryGetContext('environment') || 'dev';
// Get environment variables or use context
var mongodbUri = process.env.MONGODB_URI || app.node.tryGetContext('mongodbUri');
var jwtSecret = process.env.JWT_SECRET || app.node.tryGetContext('jwtSecret');
if (!mongodbUri) {
    throw new Error('MONGODB_URI must be provided via environment variable or context');
}
if (!jwtSecret) {
    throw new Error('JWT_SECRET must be provided via environment variable or context');
}
new ExpenseTrackerStack_1.ExpenseTrackerStack(app, "ExpenseTrackerStack-".concat(environment), {
    environment: environment,
    mongodbUri: mongodbUri,
    jwtSecret: jwtSecret,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    },
    description: "Expense Tracker Application - ".concat(environment, " environment"),
    tags: {
        Application: 'ExpenseTracker',
        Environment: environment,
    },
});
