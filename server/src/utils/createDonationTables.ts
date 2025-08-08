import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDonationTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const client = await pool.connect();
    
    console.log('🔄 Creating donation-related tables...');
    
    // Create payment_methods table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        details JSONB NOT NULL,
        qr_code VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created payment_methods table');

    // Create donors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS donors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        country VARCHAR(100),
        avatar VARCHAR(500),
        is_anonymous BOOLEAN DEFAULT false,
        total_donated INTEGER DEFAULT 0,
        donation_count INTEGER DEFAULT 0,
        last_donation TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Created donors table');

    // Create donations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        donor_id UUID NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        payment_method VARCHAR(100) NOT NULL,
        message TEXT,
        is_anonymous BOOLEAN DEFAULT false,
        status VARCHAR(20) DEFAULT 'pending',
        transaction_id VARCHAR(255),
        date TIMESTAMP DEFAULT NOW() NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Created donations table');

    // Insert sample payment methods
    await client.query(`
      INSERT INTO payment_methods (name, type, details) 
      VALUES 
        ('PayPal', 'paypal', '{"email": "donate@subanchaudhary.com"}'),
        ('Bank Transfer', 'bank', '{"account_name": "Suban Chaudhary", "account_number": "1234567890", "bank_name": "Nepal Bank", "swift_code": "NBLNPKKA"}'),
        ('eSewa', 'esewa', '{"phone": "+977-9876543210"}'),
        ('Khalti', 'khalti', '{"phone": "+977-9876543210"}')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Created sample payment methods');

    // Insert sample donors
    await client.query(`
      INSERT INTO donors (name, email, country, total_donated, donation_count, is_anonymous) 
      VALUES 
        ('John Doe', 'john@example.com', 'USA', 10000, 2, false),
        ('Anonymous', NULL, NULL, 5000, 1, true),
        ('Sarah Smith', 'sarah@example.com', 'UK', 15000, 3, false),
        ('Anonymous Wildlife Lover', NULL, 'Canada', 7500, 1, true),
        ('Mike Johnson', 'mike@example.com', 'Australia', 20000, 4, false)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Created sample donors');

    // Insert sample donations
    await client.query(`
      INSERT INTO donations (donor_id, amount, currency, payment_method, message, status, is_anonymous) 
      SELECT 
        d.id,
        CASE 
          WHEN d.name = 'John Doe' THEN 5000
          WHEN d.name = 'Anonymous' THEN 5000
          WHEN d.name = 'Sarah Smith' THEN 5000
          WHEN d.name = 'Anonymous Wildlife Lover' THEN 7500
          WHEN d.name = 'Mike Johnson' THEN 5000
          ELSE 1000
        END,
        'USD',
        CASE 
          WHEN ROW_NUMBER() OVER (ORDER BY d.created_at) % 4 = 1 THEN 'PayPal'
          WHEN ROW_NUMBER() OVER (ORDER BY d.created_at) % 4 = 2 THEN 'Bank Transfer'
          WHEN ROW_NUMBER() OVER (ORDER BY d.created_at) % 4 = 3 THEN 'eSewa'
          ELSE 'Khalti'
        END,
        CASE 
          WHEN d.name = 'John Doe' THEN 'Happy to support wildlife conservation!'
          WHEN d.name = 'Sarah Smith' THEN 'Keep up the great work protecting nature.'
          WHEN d.name = 'Mike Johnson' THEN 'Love your photography and conservation efforts.'
          ELSE 'Thank you for your amazing work.'
        END,
        'completed',
        d.is_anonymous
      FROM donors d
      WHERE NOT EXISTS (SELECT 1 FROM donations WHERE donor_id = d.id);
    `);
    console.log('✅ Created sample donations');

    // Update donor stats
    await client.query(`
      UPDATE donors 
      SET 
        total_donated = (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE donor_id = donors.id),
        donation_count = (SELECT COUNT(*) FROM donations WHERE donor_id = donors.id),
        last_donation = (SELECT MAX(date) FROM donations WHERE donor_id = donors.id);
    `);
    console.log('✅ Updated donor statistics');
    
    client.release();
    console.log('🎉 All donation tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating donation tables:', error);
  } finally {
    await pool.end();
  }
}

createDonationTables();
