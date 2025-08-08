import { supabaseAdmin } from './config/dbconnection';

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase database connection...');
  
  try {
    // Test basic connection by querying a simple table
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful!');
    console.log(`📊 Found ${data?.length || 0} blog posts in database`);
    
    // Test environment variables
    console.log('🔧 Environment variables:');
    console.log('- VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('- VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

export { testDatabaseConnection }; 