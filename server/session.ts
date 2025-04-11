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
      await client.query(`DELETE FROM user_sessions WHERE expire < NOW()`);
      console.log('Session cleanup completed');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
}