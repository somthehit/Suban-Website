import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create PostgreSQL connection pool with SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase hosted PostgreSQL
  },
  // Connection pool configuration
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 10000, // Close idle clients after 10 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
});

// Initialize Drizzle ORM with the connection pool
export const db = drizzle(pool, { schema });

// Test connection function
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ PostgreSQL connection successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    return false;
  }
};

// Export pool for manual cleanup if needed
export const closePool = async () => {
  console.log('Closing PostgreSQL connection pool...');
  await pool.end();
};

export default db;
