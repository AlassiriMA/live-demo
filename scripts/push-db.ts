import { db, pool } from '../server/db';

async function pushDB() {
  try {
    console.log('Migrating database schema...');
    
    // Create the users table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
    `);
    console.log('✓ Created users table');
    
    // Create the book_categories table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS book_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        slug TEXT NOT NULL UNIQUE,
        parent_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS book_categories_slug_idx ON book_categories(slug);
      CREATE INDEX IF NOT EXISTS book_categories_parent_idx ON book_categories(parent_id);
    `);
    console.log('✓ Created book_categories table');
    
    // Create the books table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT NOT NULL UNIQUE,
        price DOUBLE PRECISION NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        category TEXT
      );
      
      CREATE INDEX IF NOT EXISTS books_title_idx ON books(title);
      CREATE INDEX IF NOT EXISTS books_author_idx ON books(author);
    `);
    console.log('✓ Created books table');
    
    // Create the transactions table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        items JSONB NOT NULL,
        total DOUBLE PRECISION NOT NULL,
        tax DOUBLE PRECISION NOT NULL,
        payment_method TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        cashier_id INTEGER REFERENCES users(id)
      );
    `);
    console.log('✓ Created transactions table');
    
    // Create the fruit_products table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS fruit_products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        unit TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        organic BOOLEAN DEFAULT FALSE,
        image_url TEXT,
        description TEXT
      );
    `);
    console.log('✓ Created fruit_products table');
    
    // Create the fruit_orders table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS fruit_orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        items JSONB NOT NULL,
        total DOUBLE PRECISION NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created fruit_orders table');
    
    // Create the testimonials table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        rating INTEGER NOT NULL
      );
    `);
    console.log('✓ Created testimonials table');
    
    // Create the leads table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT,
        source TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created leads table');
    
    // Create the trading_pairs table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS trading_pairs (
        id SERIAL PRIMARY KEY,
        symbol1 TEXT NOT NULL,
        symbol2 TEXT NOT NULL,
        exchange TEXT NOT NULL,
        correlation DOUBLE PRECISION,
        last_updated TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created trading_pairs table');
    
    // Create the dashboards table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        layout JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created dashboards table');
    
    // Create the project_categories table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS project_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS project_categories_slug_idx ON project_categories(slug);
    `);
    console.log('✓ Created project_categories table');
    
    // Create the projects table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        style VARCHAR(100),
        primary_color VARCHAR(50),
        secondary_color VARCHAR(50),
        accent_color VARCHAR(50),
        image_url TEXT,
        tags JSONB DEFAULT '[]',
        route VARCHAR(255) NOT NULL,
        published BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        sort_order INTEGER DEFAULT 0,
        detailed_content TEXT,
        features JSONB DEFAULT '[]',
        screenshots JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
      CREATE INDEX IF NOT EXISTS projects_published_idx ON projects(published);
    `);
    console.log('✓ Created projects table');
    
    // Create the media_items table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS media_items (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INTEGER NOT NULL,
        url TEXT NOT NULL,
        alt_text TEXT,
        uploaded_by INTEGER REFERENCES users(id),
        uploaded_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created media_items table');
    
    // Create the activity_logs table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id INTEGER,
        details JSONB,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created activity_logs table');
    
    // Create the site_settings table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        value JSONB,
        category VARCHAR(100),
        description TEXT,
        created_by INTEGER REFERENCES users(id),
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Created site_settings table');
    
    console.log('Database migration completed successfully.');
  } catch (error) {
    console.error('Error migrating database:', error);
  } finally {
    await pool.end();
  }
}

pushDB();