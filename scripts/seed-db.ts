import { 
  db,
  pool 
} from "../server/db";
import {
  books,
  fruitProducts,
  testimonials,
  tradingPairs,
  users
} from "../shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");
  
  // Seed users
  await db.insert(users).values([
    { username: "admin", password: "password", role: "admin" },
    { username: "user", password: "password", role: "user" },
  ]).onConflictDoNothing({ target: [users.username] });
  console.log("✅ Users seeded");

  // Seed books for POS app
  await db.insert(books).values([
    { 
      title: "The Great Gatsby", 
      author: "F. Scott Fitzgerald", 
      isbn: "9780743273565", 
      price: 12.99, 
      stock: 42,
      category: "Fiction",
      imageUrl: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      title: "To Kill a Mockingbird", 
      author: "Harper Lee", 
      isbn: "9780061120084", 
      price: 14.99, 
      stock: 38,
      category: "Fiction",
      imageUrl: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      title: "1984", 
      author: "George Orwell", 
      isbn: "9780451524935", 
      price: 11.99, 
      stock: 54,
      category: "Fiction",
      imageUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      title: "The Hobbit", 
      author: "J.R.R. Tolkien", 
      isbn: "9780547928227", 
      price: 13.99, 
      stock: 29,
      category: "Fantasy",
      imageUrl: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg" 
    },
    { 
      title: "Pride and Prejudice", 
      author: "Jane Austen", 
      isbn: "9780141439518", 
      price: 9.99, 
      stock: 47,
      category: "Romance",
      imageUrl: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg" 
    }
  ]).onConflictDoNothing({ target: [books.isbn] });
  console.log("✅ Books seeded");
  
  // Seed fruit products
  await db.insert(fruitProducts).values([
    {
      name: "Organic Apples",
      price: 2.99,
      category: "Fruits",
      unit: "lb",
      description: "Fresh organic apples from local farms",
      stock: 100,
      organic: true,
      imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Bananas",
      price: 0.79,
      category: "Fruits",
      unit: "lb",
      description: "Fresh yellow bananas",
      stock: 150,
      organic: false,
      imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Organic Carrots",
      price: 1.99,
      category: "Vegetables",
      unit: "bunch",
      description: "Locally grown organic carrots",
      stock: 75,
      organic: true,
      imageUrl: "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Avocados",
      price: 2.49,
      category: "Fruits",
      unit: "each",
      description: "Ripe and ready to eat avocados",
      stock: 50,
      organic: false,
      imageUrl: "https://images.unsplash.com/photo-1551460188-2f8a9e9a0575?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Organic Kale",
      price: 3.49,
      category: "Vegetables",
      unit: "bunch",
      description: "Fresh organic kale",
      stock: 30,
      organic: true,
      imageUrl: "https://images.unsplash.com/photo-1550084277-eebeef716e6d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ]);
  console.log("✅ Fruit products seeded");
  
  // Seed testimonials
  await db.insert(testimonials).values([
    {
      name: "John Smith",
      company: "TechCorp",
      content: "Working with this agency transformed our digital presence. Our online engagement has increased by 150% since launching the new site.",
      rating: 5,
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Sarah Johnson",
      company: "Retail Solutions",
      content: "The team delivered an incredible website that perfectly captures our brand identity. Our conversions have doubled in just three months.",
      rating: 5,
      imageUrl: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      name: "Michael Chang",
      company: "HealthPlus",
      content: "Our healthcare platform is now both beautiful and functional. Patient satisfaction with our digital tools has increased dramatically.",
      rating: 4,
      imageUrl: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ]);
  console.log("✅ Testimonials seeded");
  
  // Seed trading pairs
  await db.insert(tradingPairs).values([
    {
      symbol1: "BTC",
      symbol2: "USDT",
      exchange: "Binance",
      correlation: 0.92
    },
    {
      symbol1: "ETH",
      symbol2: "USDT",
      exchange: "Binance",
      correlation: 0.89
    },
    {
      symbol1: "XRP",
      symbol2: "USDT",
      exchange: "Binance",
      correlation: 0.76
    },
    {
      symbol1: "BTC",
      symbol2: "USDT",
      exchange: "Coinbase",
      correlation: 0.94
    },
    {
      symbol1: "ETH",
      symbol2: "USDT",
      exchange: "Coinbase",
      correlation: 0.87
    }
  ]).onConflictDoNothing();
  console.log("✅ Trading pairs seeded");
  
  console.log("Database seeding completed!");
}

seedDatabase()
  .catch(e => {
    console.error("Error seeding database:", e);
  })
  .finally(async () => {
    await pool.end();
    process.exit(0);
  });