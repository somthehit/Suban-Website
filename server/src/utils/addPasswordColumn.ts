import { db } from '../config/database';

async function addPasswordColumn() {
  try {
    console.log('🔄 Adding password column to users table...');
    
    // Add password column if it doesn't exist
    await db.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT 'temp_password';
    `);
    
    console.log('✅ Password column added successfully!');
    console.log('⚠️  Run the create-superuser script to set up admin credentials.');
    
  } catch (error) {
    console.error('❌ Error adding password column:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  addPasswordColumn()
    .then(() => {
      console.log('🎉 Database migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to add password column:', error);
      process.exit(1);
    });
}

export { addPasswordColumn };
