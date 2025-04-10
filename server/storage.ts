import {
  users, type User, type InsertUser,
  books, type Book, type InsertBook,
  transactions, type Transaction, type InsertTransaction,
  fruitProducts, type FruitProduct, type InsertFruitProduct,
  fruitOrders, type FruitOrder, type InsertFruitOrder,
  testimonials, type Testimonial, type InsertTestimonial,
  leads, type Lead, type InsertLead,
  tradingPairs, type TradingPair, type InsertTradingPair,
  dashboards, type Dashboard, type InsertDashboard
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // POS methods
  getAllBooks(): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  getBookByIsbn(isbn: string): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(): Promise<Transaction[]>;
  
  // Fruits methods
  getAllFruitProducts(): Promise<FruitProduct[]>;
  getFruitProductById(id: number): Promise<FruitProduct | undefined>;
  createFruitProduct(product: InsertFruitProduct): Promise<FruitProduct>;
  updateFruitProduct(id: number, product: Partial<InsertFruitProduct>): Promise<FruitProduct | undefined>;
  deleteFruitProduct(id: number): Promise<boolean>;
  createFruitOrder(order: InsertFruitOrder): Promise<FruitOrder>;
  getFruitOrders(): Promise<FruitOrder[]>;
  
  // Marketing methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  createLead(lead: InsertLead): Promise<Lead>;
  
  // Trading methods
  getTradingPairs(exchange?: string): Promise<TradingPair[]>;
  getTradingPairById(id: number): Promise<TradingPair | undefined>;
  createTradingPair(pair: InsertTradingPair): Promise<TradingPair>;
  
  // BI methods
  getDashboards(userId: number): Promise<Dashboard[]>;
  getDashboardById(id: number): Promise<Dashboard | undefined>;
  createDashboard(dashboard: InsertDashboard): Promise<Dashboard>;
  updateDashboard(id: number, dashboard: Partial<InsertDashboard>): Promise<Dashboard | undefined>;
  deleteDashboard(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // POS methods
  async getAllBooks(): Promise<Book[]> {
    return await db.select().from(books);
  }

  async getBookById(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book || undefined;
  }

  async getBookByIsbn(isbn: string): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.isbn, isbn));
    return book || undefined;
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db.insert(books).values(insertBook).returning();
    return book;
  }

  async updateBook(id: number, bookUpdate: Partial<InsertBook>): Promise<Book | undefined> {
    const [updatedBook] = await db
      .update(books)
      .set(bookUpdate)
      .where(eq(books.id, id))
      .returning();
    return updatedBook || undefined;
  }

  async deleteBook(id: number): Promise<boolean> {
    const result = await db.delete(books).where(eq(books.id, id));
    return result.rowCount > 0;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.timestamp));
  }

  // Fruits methods
  async getAllFruitProducts(): Promise<FruitProduct[]> {
    return await db.select().from(fruitProducts);
  }

  async getFruitProductById(id: number): Promise<FruitProduct | undefined> {
    const [product] = await db.select().from(fruitProducts).where(eq(fruitProducts.id, id));
    return product || undefined;
  }

  async createFruitProduct(insertProduct: InsertFruitProduct): Promise<FruitProduct> {
    const [product] = await db
      .insert(fruitProducts)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateFruitProduct(id: number, productUpdate: Partial<InsertFruitProduct>): Promise<FruitProduct | undefined> {
    const [updatedProduct] = await db
      .update(fruitProducts)
      .set(productUpdate)
      .where(eq(fruitProducts.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteFruitProduct(id: number): Promise<boolean> {
    const result = await db.delete(fruitProducts).where(eq(fruitProducts.id, id));
    return result.rowCount > 0;
  }

  async createFruitOrder(insertOrder: InsertFruitOrder): Promise<FruitOrder> {
    const [order] = await db
      .insert(fruitOrders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getFruitOrders(): Promise<FruitOrder[]> {
    return await db.select().from(fruitOrders).orderBy(desc(fruitOrders.createdAt));
  }

  // Marketing methods
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  // Trading methods
  async getTradingPairs(exchange?: string): Promise<TradingPair[]> {
    if (exchange) {
      return await db
        .select()
        .from(tradingPairs)
        .where(eq(tradingPairs.exchange, exchange));
    }
    return await db.select().from(tradingPairs);
  }

  async getTradingPairById(id: number): Promise<TradingPair | undefined> {
    const [pair] = await db.select().from(tradingPairs).where(eq(tradingPairs.id, id));
    return pair || undefined;
  }

  async createTradingPair(insertPair: InsertTradingPair): Promise<TradingPair> {
    const [pair] = await db
      .insert(tradingPairs)
      .values(insertPair)
      .returning();
    return pair;
  }

  // BI methods
  async getDashboards(userId: number): Promise<Dashboard[]> {
    return await db
      .select()
      .from(dashboards)
      .where(eq(dashboards.userId, userId));
  }

  async getDashboardById(id: number): Promise<Dashboard | undefined> {
    const [dashboard] = await db.select().from(dashboards).where(eq(dashboards.id, id));
    return dashboard || undefined;
  }

  async createDashboard(insertDashboard: InsertDashboard): Promise<Dashboard> {
    const [dashboard] = await db
      .insert(dashboards)
      .values(insertDashboard)
      .returning();
    return dashboard;
  }

  async updateDashboard(id: number, dashboardUpdate: Partial<InsertDashboard>): Promise<Dashboard | undefined> {
    const [updatedDashboard] = await db
      .update(dashboards)
      .set(dashboardUpdate)
      .where(eq(dashboards.id, id))
      .returning();
    return updatedDashboard || undefined;
  }

  async deleteDashboard(id: number): Promise<boolean> {
    const result = await db.delete(dashboards).where(eq(dashboards.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();