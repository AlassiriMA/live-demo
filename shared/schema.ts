import { pgTable, text, serial, integer, boolean, jsonb, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

// POS - Books
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: text("isbn").notNull().unique(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  category: text("category"),
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  isbn: true,
  price: true,
  stock: true,
  imageUrl: true,
  category: true,
});

// POS - Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  items: jsonb("items").notNull(),
  total: doublePrecision("total").notNull(),
  tax: doublePrecision("tax").notNull(),
  paymentMethod: text("payment_method").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  cashierId: integer("cashier_id").references(() => users.id),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  items: true,
  total: true,
  tax: true,
  paymentMethod: true,
  cashierId: true,
});

// Fruits - Products
export const fruitProducts = pgTable("fruit_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: doublePrecision("price").notNull(),
  unit: text("unit").notNull(),
  stock: integer("stock").notNull().default(0),
  organic: boolean("organic").default(false),
  imageUrl: text("image_url"),
  description: text("description"),
});

export const insertFruitProductSchema = createInsertSchema(fruitProducts).pick({
  name: true,
  category: true,
  price: true,
  unit: true,
  stock: true,
  organic: true,
  imageUrl: true,
  description: true,
});

// Fruits - Orders
export const fruitOrders = pgTable("fruit_orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  items: jsonb("items").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFruitOrderSchema = createInsertSchema(fruitOrders).pick({
  customerName: true,
  customerEmail: true,
  items: true,
  total: true,
});

// Marketing - Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  company: true,
  content: true,
  imageUrl: true,
  rating: true,
});

// Marketing - Leads
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
  source: true,
});

// Trading bots shared types
export const tradingPairs = pgTable("trading_pairs", {
  id: serial("id").primaryKey(),
  symbol1: text("symbol1").notNull(),
  symbol2: text("symbol2").notNull(),
  exchange: text("exchange").notNull(),
  correlation: doublePrecision("correlation"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertTradingPairSchema = createInsertSchema(tradingPairs).pick({
  symbol1: true,
  symbol2: true,
  exchange: true,
  correlation: true,
});

// BI - Saved Dashboards
export const dashboards = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  layout: jsonb("layout").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDashboardSchema = createInsertSchema(dashboards).pick({
  name: true,
  userId: true,
  layout: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type FruitProduct = typeof fruitProducts.$inferSelect;
export type InsertFruitProduct = z.infer<typeof insertFruitProductSchema>;

export type FruitOrder = typeof fruitOrders.$inferSelect;
export type InsertFruitOrder = z.infer<typeof insertFruitOrderSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type TradingPair = typeof tradingPairs.$inferSelect;
export type InsertTradingPair = z.infer<typeof insertTradingPairSchema>;

export type Dashboard = typeof dashboards.$inferSelect;
export type InsertDashboard = z.infer<typeof insertDashboardSchema>;
