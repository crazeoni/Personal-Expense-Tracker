#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ExpenseTrackerStack } from '../stacks/ExpenseTrackerStack';

const app = new cdk.App();

const environment = app.node.tryGetContext('environment') || 'dev';

// Get environment variables or use context
const mongodbUri = process.env.MONGODB_URI || app.node.tryGetContext('mongodbUri');
const jwtSecret = process.env.JWT_SECRET || app.node.tryGetContext('jwtSecret');

if (!mongodbUri) {
  throw new Error('MONGODB_URI must be provided via environment variable or context');
}

if (!jwtSecret) {
  throw new Error('JWT_SECRET must be provided via environment variable or context');
}

new ExpenseTrackerStack(app, `ExpenseTrackerStack-${environment}`, {
  environment,
  mongodbUri,
  jwtSecret,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: `Expense Tracker Application - ${environment} environment`,
  tags: {
    Application: 'ExpenseTracker',
    Environment: environment,
  },
});