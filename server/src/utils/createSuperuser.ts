import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const SUPERUSER_EMAIL = 'somthehit@gmail.com';
const SUPERUSER_PASSWORD = 'Dssmd@4admin';
const SUPERUSER_NAME = 'Super Admin';

async function createSuperuser() {
  try {
    console.log('🔄 Creating superuser...');
    
    // Check if superuser already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, SUPERUSER_EMAIL))
      .limit(1);
    
    if (existingUser.length > 0) {
      console.log('⚠️  Superuser already exists. Updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, 12);
      
      // Update the existing user
      await db
        .update(users)
        .set({
          password: hashedPassword,
          name: SUPERUSER_NAME,
          role: 'admin',
          updated_at: new Date()
        })
        .where(eq(users.email, SUPERUSER_EMAIL));
        
      console.log('✅ Superuser password updated successfully!');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, 12);
      
      // Create the superuser
      const newUser = await db
        .insert(users)
        .values({
          email: SUPERUSER_EMAIL,
          password: hashedPassword,
          name: SUPERUSER_NAME,
          role: 'admin'
        })
        .returning();
      
      console.log('✅ Superuser created successfully!');
      console.log('📧 Email:', SUPERUSER_EMAIL);
      console.log('🆔 User ID:', newUser[0].id);
    }
    
    console.log('📝 Login credentials:');
    console.log('   Email:', SUPERUSER_EMAIL);
    console.log('   Password:', SUPERUSER_PASSWORD);
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating superuser:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  createSuperuser()
    .then(() => {
      console.log('🎉 Superuser setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to create superuser:', error);
      process.exit(1);
    });
}

export { createSuperuser };
