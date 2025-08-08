import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const client = await pool.connect();
    
    // Check existing tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Existing tables in database:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check if blog_posts table exists and has data
    try {
      const blogResult = await client.query('SELECT COUNT(*) FROM blog_posts');
      console.log(`📊 blog_posts table has ${blogResult.rows[0].count} records`);
    } catch (error) {
      console.log('❌ blog_posts table does not exist');
    }
    
    client.release();
  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    await pool.end();
  }
}

checkTables();
