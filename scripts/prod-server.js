// Production server for the portfolio application
// This script runs on the Oracle VPS and serves the built application

require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const fs = require('fs');

// Get environment variables
const PORT = process.env.PORT || 5000;
const ENABLE_COMPRESSION = process.env.ENABLE_COMPRESSION === 'true';
const ENABLE_RATE_LIMIT = process.env.ENABLE_RATE_LIMIT === 'true';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Import application routes (assuming they are built)
const { registerRoutes } = require('./server/routes');

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://api.etherscan.io']
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

// Enable rate limiting if configured
if (ENABLE_RATE_LIMIT) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use('/api/', limiter);
}

// Enable compression if configured
if (ENABLE_COMPRESSION) {
  app.use(compression());
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'client')));

// Register API routes
registerRoutes(app);

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});