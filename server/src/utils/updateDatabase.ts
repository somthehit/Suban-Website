import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function updateDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const client = await pool.connect();
    
    console.log('🔄 Updating database structure...');
    
    // Drop homepage_gallery table
    await client.query('DROP TABLE IF EXISTS homepage_gallery CASCADE;');
    console.log('✅ Dropped homepage_gallery table');
    
    // Add some sample gallery images for testing
    await client.query(`
      INSERT INTO gallery (title, category, image_url, alt_text, featured, sort_order, tags) VALUES
      ('Majestic Tiger in Sunlight', 'Wildlife', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800', 'A beautiful tiger walking in golden sunlight', true, 1, '["tiger", "wildlife", "nature"]'::jsonb),
      ('Mountain Landscape', 'Landscapes', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'Stunning mountain landscape with clear blue sky', true, 2, '["mountain", "landscape", "nature"]'::jsonb),
      ('Colorful Bird Portrait', 'Birds', 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800', 'Close-up portrait of a vibrant tropical bird', true, 3, '["bird", "colorful", "portrait"]'::jsonb),
      ('Elephant Family', 'Wildlife', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800', 'Family of elephants walking across the savanna', false, 4, '["elephant", "family", "savanna"]'::jsonb),
      ('Forest Waterfall', 'Landscapes', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800', 'Beautiful waterfall cascading through lush forest', false, 5, '["waterfall", "forest", "nature"]'::jsonb)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Added sample gallery images');
    
    // Check current gallery data
    const galleryResult = await client.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE featured = true) as featured FROM gallery');
    console.log(`📊 Gallery has ${galleryResult.rows[0].total} total images, ${galleryResult.rows[0].featured} featured`);
    
    client.release();
    console.log('🎉 Database update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
  } finally {
    await pool.end();
  }
}

updateDatabase();
