
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepInspect() {
  console.log('--- DEEP PROJECT INSPECTION ---');
  
  const { data: projects, error } = await supabase.from('projects').select('*').limit(5);
  
  if (error) {
    console.log(`   ❌ Select * Fail: ${error.message}`);
    // Try to select just ID to see if the table exists
    const { data: ids } = await supabase.from('projects').select('id');
    console.log(`   Table exists? ${!!ids}. Count: ${ids?.length || 0}`);
  } else {
    console.log(`   Found ${projects.length} projects.`);
    console.log('   Sample Project (Keys):', Object.keys(projects[0]));
    console.log('   Sample Project Data:', JSON.stringify(projects[0], null, 2));
  }

  console.log('\n--- TESTING PROJECT INSERT WITH MINIMAL DATA ---');
  const { data: minProj, error: minErr } = await supabase.from('projects').insert([{ name: 'Minimal Test' }]).select();
  if (minErr) console.log(`   ❌ Minimal Insert Fail: ${minErr.message}`);
  else console.log('   ✅ Minimal Insert PASS');
}

deepInspect();
