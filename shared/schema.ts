import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  jsonb, 
  timestamp, 
  doublePrecision, 
  varchar,
  index,
  foreignKey,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("user"),
  active: boolean("active").default(true),
  profileImageUrl: text("profile_image_url"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  };
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
  profileImageUrl: true,
});

// Book categories
export const bookCategories = pgTable("book_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id").references(() => bookCategories.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    slugIdx: index("book_categories_slug_idx").on(table.slug),
  };
});

export const insertBookCategorySchema = createInsertSchema(bookCategories).pick({
  name: true,
  description: true,
  slug: true,
  parentId: true,
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
  categoryId: integer("category_id").references(() => bookCategories.id),
  publishedDate: timestamp("published_date"),
  publisher: text("publisher"),
  language: text("language").default("English"),
  pages: integer("pages"),
  featured: boolean("featured").default(false),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    titleIdx: index("books_title_idx").on(table.title),
    authorIdx: index("books_author_idx").on(table.author),
    categoryIdx: index("books_category_idx").on(table.categoryId),
    featuredIdx: index("books_featured_idx").on(table.featured),
  };
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  isbn: true,
  price: true,
  stock: true,
  imageUrl: true,
  categoryId: true,
  publishedDate: true,
  publisher: true,
  language: true,
  pages: true,
  featured: true,
  description: true,
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  dashboards: many(dashboards),
  mediaItems: many(mediaItems),
  activityLogs: many(activityLogs),
}));

export const bookCategoriesRelations = relations(bookCategories, ({ many, one }) => ({
  books: many(books),
  parent: one(bookCategories, {
    fields: [bookCategories.parentId],
    references: [bookCategories.id],
  }),
  children: many(bookCategories),
}));

export const booksRelations = relations(books, ({ one }) => ({
  category: one(bookCategories, {
    fields: [books.categoryId],
    references: [bookCategories.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BookCategory = typeof bookCategories.$inferSelect;
export type InsertBookCategory = z.infer<typeof insertBookCategorySchema>;

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

// CMS - Project Categories
export const projectCategories = pgTable("project_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    slugIdx: index("project_categories_slug_idx").on(table.slug),
  };
});

export const insertProjectCategorySchema = createInsertSchema(projectCategories).pick({
  name: true,
  slug: true,
  description: true,
});

// CMS - Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  style: varchar("style", { length: 100 }),
  primaryColor: varchar("primary_color", { length: 50 }),
  secondaryColor: varchar("secondary_color", { length: 50 }),
  accentColor: varchar("accent_color", { length: 50 }),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").references(() => projectCategories.id),
  tags: varchar("tags", { length: 255 }),
  route: varchar("route", { length: 255 }).notNull(),
  published: boolean("published").default(true),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  detailedContent: text("detailed_content"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  features: jsonb("features").default([]),
  screenshots: jsonb("screenshots").default([]),
  status: varchar("status", { length: 50 }).default("published"),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    slugIdx: index("projects_slug_idx").on(table.slug),
    categoryIdx: index("projects_category_idx").on(table.categoryId),
    publishedIdx: index("projects_published_idx").on(table.published),
    featuredIdx: index("projects_featured_idx").on(table.featured),
    statusIdx: index("projects_status_idx").on(table.status),
  };
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  slug: true,
  name: true,
  description: true,
  style: true,
  primaryColor: true,
  secondaryColor: true,
  accentColor: true,
  imageUrl: true,
  categoryId: true,
  tags: true,
  route: true,
  published: true,
  featured: true,
  sortOrder: true,
  detailedContent: true,
  metaTitle: true,
  metaDescription: true,
  features: true,
  screenshots: true,
  status: true,
  createdBy: true,
});

export const updateProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  style: true,
  primaryColor: true,
  secondaryColor: true,
  accentColor: true,
  imageUrl: true,
  categoryId: true,
  tags: true,
  route: true,
  published: true,
  featured: true,
  sortOrder: true,
  detailedContent: true,
  metaTitle: true,
  metaDescription: true,
  features: true,
  screenshots: true,
  status: true,
  updatedBy: true,
}).partial();

// CMS - Media Library
export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileSize: integer("file_size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertMediaItemSchema = createInsertSchema(mediaItems).pick({
  filename: true,
  fileType: true,
  fileSize: true,
  url: true,
  altText: true,
  uploadedBy: true,
});

// CMS - Activity Logs
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: integer("entity_id"),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  entityType: true,
  entityId: true,
  details: true,
});

// CMS - Settings
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: jsonb("value"),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
  category: true,
  description: true,
  createdBy: true,
  updatedBy: true,
});

// Project relations
export const projectCategoriesRelations = relations(projectCategories, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  category: one(projectCategories, {
    fields: [projects.categoryId],
    references: [projectCategories.id],
  }),
  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  updater: one(users, {
    fields: [projects.updatedBy],
    references: [users.id],
  }),
}));

// Media relations
export const mediaItemsRelations = relations(mediaItems, ({ one }) => ({
  uploader: one(users, {
    fields: [mediaItems.uploadedBy],
    references: [users.id],
  }),
}));

// Activity logs relations
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// CMS Type exports
export type ProjectCategory = typeof projectCategories.$inferSelect;
export type InsertProjectCategory = z.infer<typeof insertProjectCategorySchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

export type MediaItem = typeof mediaItems.$inferSelect;
export type InsertMediaItem = z.infer<typeof insertMediaItemSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
