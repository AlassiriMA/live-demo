import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';

// Initialize PostgreSQL session store
const PostgresStore = connectPg(session);

// One day in milliseconds
const ONE_DAY = 24 * 60 * 60 * 1000;

// Create session store
export const sessionStore = new PostgresStore({
  pool,
  tableName: 'user_sessions',
  createTableIfMissing: true,
});

// Session configuration
export const sessionConfig: session.SessionOptions = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'portfolio-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: ONE_DAY
  }
};