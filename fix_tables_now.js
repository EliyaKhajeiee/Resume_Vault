// Run this in browser console to check and potentially fix the database tables

const checkAndFixTables = async () => {
  console.log('🔍 Checking database tables...');

  try {
    // First, let's see what tables exist
    const { data: tables, error: tableError } = await window.supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    console.log('📊 Available tables:', tables, 'Error:', tableError);

    // Try to query user_subscriptions directly
    const { data: subTest, error: subError } = await window.supabase
      .from('user_subscriptions')
      .select('count', { count: 'exact', head: true });

    console.log('🔍 user_subscriptions table test:', { data: subTest, error: subError });

    if (subError && subError.code === 'PGRST116') {
      console.log('❌ user_subscriptions table does not exist!');
      console.log('🛠️ You need to run the CREATE_TABLES.sql script in Supabase SQL Editor');
      return;
    }

    if (subError && subError.code === '42501') {
      console.log('❌ Permission denied on user_subscriptions table!');
      console.log('🛠️ You need to check RLS policies and permissions');
      return;
    }

    if (subError) {
      console.log('❌ Other error with user_subscriptions:', subError);
      return;
    }

    console.log('✅ user_subscriptions table exists and is accessible');

    // Now check if there are any subscriptions for the current user
    const { data: { user } } = await window.supabase.auth.getUser();
    if (user) {
      const { data: userSubs, error: userSubError } = await window.supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id);

      console.log('👤 User subscriptions:', userSubs, 'Error:', userSubError);
    }

  } catch (error) {
    console.error('❌ Exception during table check:', error);
  }
};

console.log('🚀 Run checkAndFixTables() to diagnose the database issue');
checkAndFixTables();