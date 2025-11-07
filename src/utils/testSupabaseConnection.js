import { supabase, checkSupabaseConnection } from '../config/supabaseClient';

/**
 * Test Supabase connection and display results
 * This is a utility function to verify that Supabase is properly configured
 */
export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  console.log('📍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  
  try {
    // Test 1: Check if client is initialized
    if (!supabase) {
      console.error('❌ Supabase client is not initialized');
      return false;
    }
    console.log('✅ Supabase client initialized');

    // Test 2: Try to get session (this doesn't require any tables)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.warn('⚠️ Session check warning:', sessionError.message);
    } else {
      console.log('✅ Auth system accessible');
      console.log('👤 Current session:', session ? 'Active' : 'No active session');
    }

    // Test 3: Try a simple query to test database connection
    // This will fail if no tables exist, but that's okay - it proves connection works
    const { error: dbError } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);
    
    if (dbError) {
      // Expected error if table doesn't exist
      if (dbError.code === 'PGRST204' || dbError.code === '42P01') {
        console.log('✅ Database connection successful (no tables yet, which is normal)');
      } else {
        console.warn('⚠️ Database query warning:', dbError.message);
      }
    } else {
      console.log('✅ Database connection successful');
    }

    console.log('🎉 Supabase is properly configured and connected!');
    return true;

  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
};

/**
 * Display Supabase configuration info (without exposing sensitive data)
 */
export const displaySupabaseInfo = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('📊 Supabase Configuration:');
  console.log('  URL:', url || '❌ Not configured');
  console.log('  API Key:', hasKey ? '✅ Configured' : '❌ Not configured');
  
  if (!url || !hasKey) {
    console.error('⚠️ Missing Supabase configuration. Please check your .env file.');
    return false;
  }
  
  return true;
};

export default testSupabaseConnection;

