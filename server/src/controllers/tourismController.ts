import { Request, Response } from 'express';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Get all tourism data (public)
export const getAllTourism = async (req: Request, res: Response) => {
  try {
    const { type, category, featured, limit } = req.query;
    
    let query = 'SELECT * FROM tourism WHERE 1=1';
    const values: any[] = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      values.push(type);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      values.push(category);
    }

    if (featured !== undefined) {
      paramCount++;
      query += ` AND featured = $${paramCount}`;
      values.push(featured === 'true');
    }

    query += ' ORDER BY created_at DESC';

    if (limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      values.push(parseInt(limit as string));
    }

    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching tourism data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tourism data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get tourism by ID (public)
export const getTourismById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tourism WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tourism item not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching tourism item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tourism item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create tourism item (admin)
export const createTourism = async (req: Request, res: Response) => {
  try {
    const {
      type,
      title,
      description,
      shortDescription,
      location,
      duration,
      price,
      currency,
      category,
      difficulty,
      rating,
      reviewCount,
      images,
      availability,
      featured
    } = req.body;

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO tourism (
        type, title, description, shortdescription, location, duration, 
        price, currency, category, difficulty, rating, reviewcount, 
        images, availability, featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING *`,
      [
        type, title, description, shortDescription, location, duration,
        price, currency || 'USD', category, difficulty, rating || 0,
        reviewCount || 0, JSON.stringify(images || []), 
        JSON.stringify(availability || {}), featured || false
      ]
    );
    client.release();

    res.status(201).json({
      success: true,
      message: 'Tourism item created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating tourism item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tourism item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update tourism item (admin)
export const updateTourism = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      type,
      title,
      description,
      shortDescription,
      location,
      duration,
      price,
      currency,
      category,
      difficulty,
      rating,
      reviewCount,
      images,
      availability,
      featured
    } = req.body;

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE tourism SET 
        type = $1, title = $2, description = $3, shortdescription = $4, 
        location = $5, duration = $6, price = $7, currency = $8, 
        category = $9, difficulty = $10, rating = $11, reviewcount = $12, 
        images = $13, availability = $14, featured = $15, updated_at = NOW()
      WHERE id = $16 RETURNING *`,
      [
        type, title, description, shortDescription, location, duration,
        price, currency, category, difficulty, rating, reviewCount,
        JSON.stringify(images), JSON.stringify(availability), featured, id
      ]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tourism item not found'
      });
    }

    res.json({
      success: true,
      message: 'Tourism item updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating tourism item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tourism item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete tourism item (admin)
export const deleteTourism = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    const result = await client.query('DELETE FROM tourism WHERE id = $1 RETURNING *', [id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tourism item not found'
      });
    }

    res.json({
      success: true,
      message: 'Tourism item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tourism item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tourism item',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get tourism stats (admin)
export const getTourismStats = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    
    const totalResult = await client.query('SELECT COUNT(*) as total FROM tourism');
    const featuredResult = await client.query('SELECT COUNT(*) as featured FROM tourism WHERE featured = true');
    const typeStatsResult = await client.query(`
      SELECT type, COUNT(*) as count 
      FROM tourism 
      GROUP BY type 
      ORDER BY count DESC
    `);
    
    client.release();

    res.json({
      success: true,
      data: {
        total: parseInt(totalResult.rows[0].total),
        featured: parseInt(featuredResult.rows[0].featured),
        byType: typeStatsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching tourism stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tourism stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
