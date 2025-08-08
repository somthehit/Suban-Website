import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const client = await pool.connect();
    
    console.log('🔄 Creating database tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created users table');

    // Create blog_posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image VARCHAR(500),
        tags JSONB DEFAULT '[]'::jsonb,
        published BOOLEAN DEFAULT false,
        author_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        published_at TIMESTAMP,
        meta_title VARCHAR(60),
        meta_description VARCHAR(160),
        read_time INTEGER
      );
    `);
    console.log('✅ Created blog_posts table');

    // Create gallery table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        caption TEXT,
        alt_text VARCHAR(255) NOT NULL,
        tags JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created gallery table');

    // Create homepage_gallery table
    await client.query(`
      CREATE TABLE IF NOT EXISTS homepage_gallery (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        gallery_image_id UUID NOT NULL,
        position INTEGER DEFAULT 0,
        size VARCHAR(10) NOT NULL DEFAULT 'medium',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created homepage_gallery table');

    // Create contact_messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created contact_messages table');

    // Create join_requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS join_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        reason TEXT NOT NULL,
        experience_level VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created join_requests table');

    // Create site_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key VARCHAR(255) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        type VARCHAR(20) DEFAULT 'text',
        description TEXT,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created site_settings table');
    
    // Insert a sample admin user
    await client.query(`
      INSERT INTO users (email, name, role) 
      VALUES ('admin@suban.com', 'Admin User', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Created sample admin user');

// Create tourism table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tourism (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        shortDescription VARCHAR(255),
        location VARCHAR(255),
        duration VARCHAR(50),
        price NUMERIC(10, 2),
        currency VARCHAR(10) DEFAULT 'USD',
        category VARCHAR(100),
        difficulty VARCHAR(50),
        rating NUMERIC(3, 2) DEFAULT 0.0,
        reviewCount INT DEFAULT 0,
        images JSONB,
        availability JSONB,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created tourism table');

    
    await client.query(`
      INSERT INTO blog_posts (
        title, slug, content, excerpt, published, author_id, tags
      )
      SELECT 
        'Welcome to Suban Wildlife Photography',
        'welcome-to-suban-wildlife-photography',
        '<p>Welcome to our wildlife photography website! Here you''ll find amazing stories and stunning photographs from the wild.</p>',
        'Welcome to our wildlife photography website with amazing stories and stunning photographs.',
        true,
        u.id,
        '["wildlife", "photography", "nature"]'::jsonb
      FROM users u 
      WHERE u.email = 'admin@suban.com'
      AND NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'welcome-to-suban-wildlife-photography');
    `);
    console.log('✅ Created sample blog post');
    
    client.release();
    console.log('🎉 All tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

createTables();
