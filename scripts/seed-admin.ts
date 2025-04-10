import { db } from '../server/db';
import { users } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
  try {
    console.log('Checking if admin user exists...');
    
    // Check if admin user already exists
    const adminUsers = await db.select().from(users).where(eq(users.username, 'admin'));
    
    if (adminUsers.length > 0) {
      console.log('Admin user already exists, skipping creation');
      return;
    }
    
    console.log('Creating admin user...');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Insert admin user
    const [newAdmin] = await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    }).returning();
    
    console.log('Admin user created successfully:', { id: newAdmin.id, username: newAdmin.username, role: newAdmin.role });
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the seeding function
seedAdmin();