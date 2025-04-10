// Basic script to create an admin user directly in the database
import bcrypt from 'bcryptjs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure neonConfig to use WebSocket
neonConfig.webSocketConstructor = ws;

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    // Connect to the database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    // Check if admin user already exists
    const checkResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      ['admin']
    );
    
    if (checkResult.rowCount > 0) {
      console.log('Admin user already exists');
      await pool.end();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Insert admin user
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      ['admin', hashedPassword, 'admin']
    );
    
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    await pool.end();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();