import * as dotenv from 'dotenv';

// Load environment variables before importing supabase config
dotenv.config();

/**
 * Test to verify that supabase.ts can be imported in isolation
 * and that required environment variables are present
 */
function testSupabaseEnvironmentVariables() {
  console.log('🧪 Testing Supabase environment variables...');
  
  // Check that required environment variables are present
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars: string[] = [];
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
    } else {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    }
  });
  
  if (missingVars.length > 0) {
    console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are present');
  return true;
}

/**
 * Test that supabase configuration can be imported without errors
 */
async function testSupabaseImport() {
  console.log('🧪 Testing Supabase configuration import...');
  
  try {
    // Import the supabase configuration
    const supabaseConfig = await import('../config/supabase');
    
    console.log('✅ Supabase configuration imported successfully');
    
    // Verify that the exported functions exist
    if (typeof supabaseConfig.createSupabaseAdmin !== 'function') {
      throw new Error('createSupabaseAdmin function not exported');
    }
    
    if (typeof supabaseConfig.createSupabaseClient !== 'function') {
      throw new Error('createSupabaseClient function not exported');
    }
    
    // Verify that instances are created
    if (!supabaseConfig.supabaseAdmin) {
      throw new Error('supabaseAdmin instance not created');
    }
    
    if (!supabaseConfig.supabaseClient) {
      throw new Error('supabaseClient instance not created');
    }
    
    console.log('✅ All Supabase exports are valid');
    
    // Test that the clients have expected properties
    if (!supabaseConfig.supabaseAdmin.auth) {
      throw new Error('supabaseAdmin missing auth property');
    }
    
    if (!supabaseConfig.supabaseClient.auth) {
      throw new Error('supabaseClient missing auth property');
    }
    
    console.log('✅ Supabase clients have expected structure');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to import supabase configuration:', error);
    process.exit(1);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Supabase configuration tests...\n');
  
  try {
    testSupabaseEnvironmentVariables();
    await testSupabaseImport();
    
    console.log('\n🎉 All tests passed! Supabase configuration is working correctly.');
  } catch (error) {
    console.error('\n💥 Tests failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { testSupabaseEnvironmentVariables, testSupabaseImport, runTests };
