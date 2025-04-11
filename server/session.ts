import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';

// Initialize PostgreSQL session store
const PostgresStore = connectPg(session);

// Time constants in milliseconds
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = ONE_DAY * 7;

/**
 * Create session store with PostgreSQL backend
 * - Enables persistent sessions across server restarts
 * - Automatically handles session expiration and cleanup
 */
export const sessionStore = new PostgresStore({
  pool,
  tableName: 'user_sessions',
  createTableIfMissing: true,
  pruneSessionInterval: ONE_DAY, // Auto cleanup once per day
  errorLog: console.error,
});

/**
 * Session configuration 
 * - Provides secure defaults
 * - Uses environment variables when available
 */
export const sessionConfig: session.SessionOptions = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'portfolio-secret-key',
  name: 'portfolio.sid', // Custom session cookie name for security
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: ONE_WEEK, // Extend session lifetime to one week
    sameSite: 'lax' // Protect against CSRF
  }
};

// Session cleanup function
export async function cleanupSessions(): Promise<void> {
  try {
    const client = await pool.connect();
    try {
      // Delete expired sessions
      const result = await client.query(`DELETE FROM user_sessions WHERE expire < NOW()`);
      console.log(`Session cleanup completed: ${result.rowCount || 0} expired sessions removed`);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Session cleanup error:', error);
    
    // Retry after a delay if this was a connection issue
    if (error instanceof Error && 
        (error.message.includes('connection') || error.message.includes('timeout'))) {
      console.log('Will retry session cleanup in 30 seconds');
      setTimeout(cleanupSessions, 30000);
    }
  }
}

// Schedule regular session cleanup
const SESSION_CLEANUP_INTERVAL = 12 * 60 * 60 * 1000; // Every 12 hours
setInterval(cleanupSessions, SESSION_CLEANUP_INTERVAL);