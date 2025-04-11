// Database connection test script
import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

async function testConnection() {
  console.log("Testing database connection...");
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is not set");
    return false;
  }
  
  // Create a new Pool (not importing from server/db.ts to avoid any potential issues)
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
  });
  
  try {
    console.log("Attempting to connect to database...");
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT current_database() as db_name');
      const dbName = result.rows[0].db_name;
      console.log(`✅ SUCCESS: Connected to database "${dbName}"`);
      
      // Test a schema query to verify schema access
      console.log("Testing schema access...");
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      console.log("Database tables:");
      tablesResult.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
      
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ ERROR: Database connection failed:", error.message);
    return false;
  } finally {
    await pool.end();
  }
}

// Run the test
testConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Unexpected error:", err);
    process.exit(1);
  });