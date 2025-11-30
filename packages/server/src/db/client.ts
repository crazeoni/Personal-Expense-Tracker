import { MongoClient, Db } from 'mongodb';
import { config } from '../config/env';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(config.mongodb.uri);
    await client.connect();
    
    db = client.db();
    
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Disconnected from MongoDB');
  }
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
};