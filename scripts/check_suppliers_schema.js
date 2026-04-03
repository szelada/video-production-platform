
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const profile = { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', full_name: 'Test Profile', avatar_url: '' };

  try {
    const { data, error } = await supabase.from('profiles').insert([profile]);
    if (error) {
      console.log('Insert error:', error.message);
    } else {
      console.log('Insert successful');
    }
  } catch (err) {
    console.error('Catch error:', err);
  }
}

testInsert();
