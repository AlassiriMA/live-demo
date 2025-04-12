import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Import security packages
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply production security middleware
if (process.env.NODE_ENV === 'production') {
  // Add security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://*.replit.app', 'https://*.alassiri.nl'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", 'https://api.etherscan.io', 'https://api.openai.com', 'https://app.improvmx.com'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      }
    },
    crossOriginEmbedderPolicy: false, // Allow loading resources from different origins
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));
  
  // Enable compression
  if (process.env.ENABLE_COMPRESSION === 'true') {
    app.use(compression());
  }
  
  // Enable rate limiting
  if (process.env.ENABLE_RATE_LIMIT === 'true') {
    const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: 'Too many requests, please try again later.' }
    });
    app.use('/api/', apiLimiter);
  }
  
  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  };
  app.use(cors(corsOptions));
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // For production, don't expose error details to clients
    const isProd = process.env.NODE_ENV === 'production';
    const clientErrorMsg = isProd && status >= 500 
      ? 'An unexpected error occurred. Please try again later.' 
      : message;
    
    // Log detailed error information for non-404 errors
    if (status !== 404) {
      console.error(`[ERROR] ${req.method} ${req.path} - Status: ${status} - ${message}`);
      
      // Log stack trace in development only
      if (!isProd && err.stack) {
        console.error(err.stack);
      }
    }

    res.status(status).json({ 
      success: false,
      message: clientErrorMsg,
      path: req.path,
      code: err.code || 'INTERNAL_ERROR'
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
