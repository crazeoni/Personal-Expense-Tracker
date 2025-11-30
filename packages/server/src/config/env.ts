const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
};

export const config = {
  mongodb: {
    uri: getEnvVar('MONGODB_URI'),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
  },
  api: {
    port: parseInt(getEnvVar('PORT', '3001'), 10),
    corsOrigin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
  },
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
} as const;