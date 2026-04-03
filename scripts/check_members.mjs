
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMembers() {
  console.log('--- CHECKING PROJECT_MEMBERS ACCESSIBILITY ---');
  
  const { data, error } = await supabase.from('project_members').select('*').limit(1);
  if (error) {
    console.log(`   ❌ project_members Access Fail: ${error.message}`);
  } else {
    console.log(`   ✅ project_members Access PASS (Found ${data.length} records)`);
  }

  const { data: prof, error: pErr } = await supabase.from('profiles').select('*').limit(1);
    if (pErr) console.log(`   ❌ profiles Access Fail: ${pErr.message}`);
    else console.log(`   ✅ profiles Access PASS (Found ${prof.length} records)`);
}

checkMembers();
