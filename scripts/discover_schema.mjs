
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function discover() {
  console.log('--- SCHEMA DISCOVERY ---');
  
  const tables = ['suppliers', 'scouting_reports', 'project_activity'];
  
  for (const table of tables) {
    console.log(`\nTable: ${table}`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`   ❌ Select Fail: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
    } else {
      console.log('   Table is empty, trying to probe columns via select empty...');
      // This is a trick to get keys if empty but table exists
      const { data: empty } = await supabase.from(table).select('*').limit(0);
      console.log(`   Status: Table exists but is empty.`);
    }
  }
}

discover();
