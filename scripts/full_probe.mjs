
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fullProbe() {
  console.log('--- FULL PROJECT_ACTIVITY PROBE ---');
  
  // Try to insert a row with garbage to see the error message which often lists missing columns or constraint violations
  const { data, error } = await supabase.from('project_activity').insert([{ action: 'test' }]).select();
  if (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Hint: ${error.hint || 'No hint'}`);
    console.log(`Details: ${error.details || 'No details'}`);
  }

  // Also probe Scouting Reports to see if it has other hidden columns
  console.log('\n--- SCOUTING REPORTS PROBE ---');
  const { error: sErr } = await supabase.from('scouting_reports').insert([{ notes: 'test' }]).select();
  if (sErr) console.log(`Error: ${sErr.message}`);
}

fullProbe();
