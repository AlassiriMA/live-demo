import bcrypt from 'bcryptjs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { users, insertUserSchema, type InsertUser } from '../shared/schema';
import { eq } from 'drizzle-orm';
import ws from 'ws';

// Configure neon connection for WebSockets
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seedAdmin() {
  console.log('Checking if admin user exists...');
  
  // Check if admin user already exists
  const existingAdmin = await db.select()
    .from(users)
    .where(eq(users.username, 'admin'))
    .execute();
  
  if (existingAdmin.length > 0) {
    console.log('Admin user already exists');
    await pool.end();
    return;
  }
  
  // Create admin user
  console.log('Creating admin user...');
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  
  // Insert admin user
  await db.insert(users)
    .values({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    })
    .execute();
  
  console.log('Admin user created successfully!');
  console.log('Username: admin');
  console.log('Password: admin123');
  
  await pool.end();
}

seedAdmin().catch(error => {
  console.error('Error seeding admin user:', error);
  process.exit(1);
});