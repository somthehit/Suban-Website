import { testConnection } from '../config/database';

async function runDatabaseTest() {
  console.log('🔄 Testing PostgreSQL database connection...');
  
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('✅ Database connection test passed!');
    process.exit(0);
  } else {
    console.log('❌ Database connection test failed!');
    process.exit(1);
  }
}

runDatabaseTest();
