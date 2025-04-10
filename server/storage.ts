import {
  User, 
  InsertUser, 
  Book, 
  InsertBook,
  Transaction,
  InsertTransaction,
  FruitProduct,
  InsertFruitProduct,
  FruitOrder,
  InsertFruitOrder,
  Testimonial,
  InsertTestimonial,
  Lead,
  InsertLead,
  TradingPair,
  InsertTradingPair,
  Dashboard,
  InsertDashboard
} from "@shared/schema";

// Storage interface
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private transactions: Map<number, Transaction>;
  private fruitProducts: Map<number, FruitProduct>;
  private fruitOrders: Map<number, FruitOrder>;
  private testimonials: Map<number, Testimonial>;
  private leads: Map<number, Lead>;
  private tradingPairs: Map<number, TradingPair>;
  private dashboards: Map<number, Dashboard>;
  
  private currentIds: {
    users: number;
    books: number;
    transactions: number;
    fruitProducts: number;
    fruitOrders: number;
    testimonials: number;
    leads: number;
    tradingPairs: number;
    dashboards: number;
  };

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.transactions = new Map();
    this.fruitProducts = new Map();
    this.fruitOrders = new Map();
    this.testimonials = new Map();
    this.leads = new Map();
    this.tradingPairs = new Map();
    this.dashboards = new Map();
    
    this.currentIds = {
      users: 1,
      books: 1,
      transactions: 1,
      fruitProducts: 1,
      fruitOrders: 1,
      testimonials: 1,
      leads: 1,
      tradingPairs: 1,
      dashboards: 1
    };
    
    // Initialize with demo data
    this.initializeData();
  }

  private initializeData() {
    // Add a default admin user
    this.createUser({
      username: 'admin',
      password: 'password',
      role: 'admin'
    });
    
    // Initialize other demo data as needed
    this.initializeBookstoreData();
    this.initializeFruitData();
    this.initializeMarketingData();
    this.initializeTradingData();
  }
  
  private initializeBookstoreData() {
    const books: InsertBook[] = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        price: 12.99,
        stock: 25,
        category: "Fiction",
        imageUrl: ""
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084",
        price: 14.50,
        stock: 18,
        category: "Fiction",
        imageUrl: ""
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        price: 11.75,
        stock: 32,
        category: "Dystopian",
        imageUrl: ""
      }
    ];
    
    books.forEach(book => this.createBook(book));
  }
  
  private initializeFruitData() {
    const fruits: InsertFruitProduct[] = [
      {
        name: "Organic Apples",
        category: "Fruits",
        price: 3.99,
        unit: "lb",
        stock: 50,
        organic: true,
        description: "Fresh organic apples from local farms",
        imageUrl: ""
      },
      {
        name: "Bananas",
        category: "Fruits",
        price: 0.99,
        unit: "lb",
        stock: 100,
        organic: false,
        description: "Sweet and ripe bananas",
        imageUrl: ""
      },
      {
        name: "Organic Spinach",
        category: "Vegetables",
        price: 4.50,
        unit: "bunch",
        stock: 30,
        organic: true,
        description: "Nutrient-rich organic spinach",
        imageUrl: ""
      }
    ];
    
    fruits.forEach(fruit => this.createFruitProduct(fruit));
  }
  
  private initializeMarketingData() {
    const testimonials: InsertTestimonial[] = [
      {
        name: "John Smith",
        company: "Tech Innovators",
        content: "The marketing strategies provided exceptional results for our campaign!",
        rating: 5,
        imageUrl: ""
      },
      {
        name: "Sarah Johnson",
        company: "Green Solutions",
        content: "Our social media presence improved dramatically after working with this team.",
        rating: 4,
        imageUrl: ""
      }
    ];
    
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }
  
  private initializeTradingData() {
    const pairs: InsertTradingPair[] = [
      {
        symbol1: "BTC",
        symbol2: "USDT",
        exchange: "Binance",
        correlation: 0
      },
      {
        symbol1: "ETH",
        symbol2: "USDT",
        exchange: "Binance",
        correlation: 0.87
      },
      {
        symbol1: "ETH",
        symbol2: "BTC",
        exchange: "Binance",
        correlation: 0.92
      },
      {
        symbol1: "ETH",
        symbol2: "USD",
        exchange: "DYDX",
        correlation: 0.85
      },
      {
        symbol1: "BTC",
        symbol2: "USD",
        exchange: "DYDX",
        correlation: 0.81
      }
    ];
    
    pairs.forEach(pair => this.createTradingPair(pair));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // POS methods
  async getAllBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }
  
  async getBookById(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }
  
  async getBookByIsbn(isbn: string): Promise<Book | undefined> {
    return Array.from(this.books.values()).find(book => book.isbn === isbn);
  }
  
  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.currentIds.books++;
    const book: Book = { ...insertBook, id };
    this.books.set(id, book);
    return book;
  }
  
  async updateBook(id: number, bookUpdate: Partial<InsertBook>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...bookUpdate };
    this.books.set(id, updatedBook);
    return updatedBook;
  }
  
  async deleteBook(id: number): Promise<boolean> {
    return this.books.delete(id);
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentIds.transactions++;
    const now = new Date();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      timestamp: now
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
  
  // Fruits methods
  async getAllFruitProducts(): Promise<FruitProduct[]> {
    return Array.from(this.fruitProducts.values());
  }
  
  async getFruitProductById(id: number): Promise<FruitProduct | undefined> {
    return this.fruitProducts.get(id);
  }
  
  async createFruitProduct(insertProduct: InsertFruitProduct): Promise<FruitProduct> {
    const id = this.currentIds.fruitProducts++;
    const product: FruitProduct = { ...insertProduct, id };
    this.fruitProducts.set(id, product);
    return product;
  }
  
  async updateFruitProduct(id: number, productUpdate: Partial<InsertFruitProduct>): Promise<FruitProduct | undefined> {
    const product = this.fruitProducts.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate };
    this.fruitProducts.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteFruitProduct(id: number): Promise<boolean> {
    return this.fruitProducts.delete(id);
  }
  
  async createFruitOrder(insertOrder: InsertFruitOrder): Promise<FruitOrder> {
    const id = this.currentIds.fruitOrders++;
    const now = new Date();
    const order: FruitOrder = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: now
    };
    this.fruitOrders.set(id, order);
    return order;
  }
  
  async getFruitOrders(): Promise<FruitOrder[]> {
    return Array.from(this.fruitOrders.values());
  }
  
  // Marketing methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentIds.testimonials++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentIds.leads++;
    const now = new Date();
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: now
    };
    this.leads.set(id, lead);
    return lead;
  }
  
  // Trading methods
  async getTradingPairs(exchange?: string): Promise<TradingPair[]> {
    const pairs = Array.from(this.tradingPairs.values());
    if (exchange) {
      return pairs.filter(pair => pair.exchange === exchange);
    }
    return pairs;
  }
  
  async getTradingPairById(id: number): Promise<TradingPair | undefined> {
    return this.tradingPairs.get(id);
  }
  
  async createTradingPair(insertPair: InsertTradingPair): Promise<TradingPair> {
    const id = this.currentIds.tradingPairs++;
    const now = new Date();
    const pair: TradingPair = {
      ...insertPair,
      id,
      lastUpdated: now
    };
    this.tradingPairs.set(id, pair);
    return pair;
  }
  
  // BI methods
  async getDashboards(userId: number): Promise<Dashboard[]> {
    return Array.from(this.dashboards.values())
      .filter(dashboard => dashboard.userId === userId);
  }
  
  async getDashboardById(id: number): Promise<Dashboard | undefined> {
    return this.dashboards.get(id);
  }
  
  async createDashboard(insertDashboard: InsertDashboard): Promise<Dashboard> {
    const id = this.currentIds.dashboards++;
    const now = new Date();
    const dashboard: Dashboard = {
      ...insertDashboard,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.dashboards.set(id, dashboard);
    return dashboard;
  }
  
  async updateDashboard(id: number, dashboardUpdate: Partial<InsertDashboard>): Promise<Dashboard | undefined> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) return undefined;
    
    const now = new Date();
    const updatedDashboard = { 
      ...dashboard, 
      ...dashboardUpdate,
      updatedAt: now
    };
    this.dashboards.set(id, updatedDashboard);
    return updatedDashboard;
  }
  
  async deleteDashboard(id: number): Promise<boolean> {
    return this.dashboards.delete(id);
  }
}

export const storage = new MemStorage();
