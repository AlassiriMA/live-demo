import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBookSchema, 
  insertTransactionSchema,
  insertFruitProductSchema,
  insertFruitOrderSchema,
  insertLeadSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { sessionConfig } from './session';

// Import route files
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import mediaRoutes from './routes/media';
import settingsRoutes from './routes/settings';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up cookie parser for auth
  app.use(cookieParser());
  
  // Set up session middleware with PostgreSQL session store
  app.use(session(sessionConfig));
  
  // Set up CMS routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes); // Make projects directly accessible at /api/projects
  app.use('/api/cms/media', mediaRoutes);
  app.use('/api/settings', settingsRoutes); // Direct route for better accessibility
  
  // Health check endpoint for monitoring
  app.get('/health', async (_req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      services: {
        database: { status: 'checking' },
        server: { status: 'up' }
      }
    };
    
    try {
      // Check database connection
      try {
        // Try to get a user to test DB connection
        await storage.getUserByUsername('admin');
        healthcheck.services.database.status = 'up';
      } catch (dbError) {
        healthcheck.services.database.status = 'down';
        healthcheck.message = 'Database connection failed';
      }
      
      const status = healthcheck.services.database.status === 'up' ? 200 : 503;
      res.status(status).json(healthcheck);
    } catch (error) {
      healthcheck.message = error instanceof Error ? error.message : 'Error';
      res.status(503).json(healthcheck);
    }
  });
  
  // Error handling middleware for Zod validation
  const handleZodError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      res.status(400).json({ message: validationError.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // NOTE: Public site settings are now handled by the /api/settings route

  // POS Routes
  app.get('/api/pos/books', async (_req, res) => {
    try {
      const books = await storage.getAllBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch books' });
    }
  });
  
  app.get('/api/pos/books/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBookById(id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch book' });
    }
  });
  
  app.post('/api/pos/books', async (req, res) => {
    try {
      const bookData = insertBookSchema.parse(req.body);
      const book = await storage.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.put('/api/pos/books/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bookData = insertBookSchema.partial().parse(req.body);
      const book = await storage.updateBook(id, bookData);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.delete('/api/pos/books/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBook(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete book' });
    }
  });
  
  app.post('/api/pos/transactions', async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.get('/api/pos/transactions', async (_req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch transactions' });
    }
  });

  // Fruits Routes
  app.get('/api/fruits/products', async (_req, res) => {
    try {
      const products = await storage.getAllFruitProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });
  
  app.get('/api/fruits/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getFruitProductById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });
  
  app.post('/api/fruits/products', async (req, res) => {
    try {
      const productData = insertFruitProductSchema.parse(req.body);
      const product = await storage.createFruitProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.put('/api/fruits/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertFruitProductSchema.partial().parse(req.body);
      const product = await storage.updateFruitProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.post('/api/fruits/orders', async (req, res) => {
    try {
      const orderData = insertFruitOrderSchema.parse(req.body);
      const order = await storage.createFruitOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.get('/api/fruits/orders', async (_req, res) => {
    try {
      const orders = await storage.getFruitOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  // Marketing Routes
  app.get('/api/marketing/testimonials', async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  });
  
  app.post('/api/marketing/leads', async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.status(201).json(lead);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Trading Routes
  app.get('/api/trading/pairs', async (req, res) => {
    try {
      const exchange = req.query.exchange as string | undefined;
      const pairs = await storage.getTradingPairs(exchange);
      res.json(pairs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trading pairs' });
    }
  });
  
  app.get('/api/trading/pairs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pair = await storage.getTradingPairById(id);
      if (!pair) {
        return res.status(404).json({ message: 'Trading pair not found' });
      }
      res.json(pair);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trading pair' });
    }
  });

  // BI Routes
  app.get('/api/bi/dashboards', async (req, res) => {
    try {
      // In a real app, userId would come from authenticated session
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const dashboards = await storage.getDashboards(userId);
      res.json(dashboards);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboards' });
    }
  });
  
  app.get('/api/bi/dashboards/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dashboard = await storage.getDashboardById(id);
      if (!dashboard) {
        return res.status(404).json({ message: 'Dashboard not found' });
      }
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch dashboard' });
    }
  });
  
  app.post('/api/bi/dashboards', async (req, res) => {
    try {
      const dashboardData = req.body;
      // Validation would normally happen here
      const dashboard = await storage.createDashboard(dashboardData);
      res.status(201).json(dashboard);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create dashboard' });
    }
  });
  
  app.put('/api/bi/dashboards/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dashboardData = req.body;
      // Validation would normally happen here
      const dashboard = await storage.updateDashboard(id, dashboardData);
      if (!dashboard) {
        return res.status(404).json({ message: 'Dashboard not found' });
      }
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update dashboard' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
