import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function probe() {
  console.log('Probing tables...');
  
  const tables = ['call_sheets', 'call_sheet_crew', 'call_sheet_schedule'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error probing ${table}:`, error.message);
    } else {
      console.log(`Table ${table} exists and is accessible.`);
    }
  }
}

probe();
