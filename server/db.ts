import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

// Verify database connection is available
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with optimized settings
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // Maximum time to wait for connection
});

// Initialize Drizzle ORM with schema
export const db = drizzle({ client: pool, schema });

/**
 * Retry a database operation with exponential backoff
 * @param operation The database operation to retry
 * @param maxRetries Maximum number of retries (default: 3)
 * @param retryDelay Initial delay in ms (default: 200ms, will be doubled each retry)
 * @returns Result of the database operation
 */
export async function retryDb<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 200
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on connection-related errors
      if (!isRetryableError(error)) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        // Log the retry attempt
        console.warn(`Database operation failed, retrying (${attempt + 1}/${maxRetries})...`, 
          error.message || error);
          
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      }
    }
  }
  
  // If we get here, all retries failed
  console.error(`Database operation failed after ${maxRetries} retries`);
  throw lastError;
}

// Helper to identify errors that can be retried
function isRetryableError(error: any): boolean {
  if (!error) return false;
  
  // Check for common connection error patterns
  const message = error.message || String(error);
  const retryablePatterns = [
    /connection.*terminated/i,
    /connection.*refused/i,
    /network.*timeout/i,
    /timeout.*expired/i,
    /idle.*timeout/i,
    /connection.*closed/i,
    /cannot.*connect/i,
    /too.*many.*clients/i
  ];
  
  return retryablePatterns.some(pattern => pattern.test(message));
}

// Health check function for database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Connection event handlers for monitoring
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  
  // Attempt to recover the connection pool if needed
  setTimeout(() => {
    console.log('Attempting to recover database connection...');
    checkDatabaseConnection()
      .then(isConnected => {
        if (isConnected) {
          console.log('Database connection recovered');
        } else {
          console.error('Failed to recover database connection');
        }
      })
      .catch(error => {
        console.error('Error during connection recovery attempt:', error);
      });
  }, 5000);
});

pool.on('connect', () => {
  console.log('New database connection established');
});

// Initialize connection pool validation interval
const POOL_CHECK_INTERVAL = 30000; // 30 seconds

// Start connection pool validator
setInterval(async () => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.warn('Database connection check failed, attempting recovery...');
      // Allow the pool to attempt reconnection naturally
    }
  } catch (error) {
    console.error('Error during connection pool validation:', error);
  }
}, POOL_CHECK_INTERVAL);

// Execute initial connection test
checkDatabaseConnection()
  .then(isConnected => {
    if (isConnected) {
      console.log('Initial database connection successful');
    } else {
      console.warn('Initial database connection failed, will retry automatically');
    }
  })
  .catch(error => {
    console.error('Error during initial database connection test:', error);
  });