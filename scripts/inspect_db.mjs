
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  console.log('--- DB INSPECTION ---');
  
  const { data: pCount } = await supabase.from('profiles').select('id');
  console.log(`Profiles found: ${pCount?.length || 0}`);

  const { data: prCount } = await supabase.from('projects').select('id');
  console.log(`Projects found: ${prCount?.length || 0}`);

  // Check new tables
  const tables = ['catering_orders', 'transport_requests', 'project_budgets', 'project_expenses', 'project_budget_summary'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
       console.log(`   ❌ Table ${table}: ${error.code} - ${error.message}`);
    } else {
       console.log(`   ✅ Table ${table}: Found`);
    }
  }
}

inspect();
