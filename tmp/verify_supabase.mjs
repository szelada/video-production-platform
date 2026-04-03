import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('--- Checking Supabase Data ---');
  
  const { data: projects, error: pError } = await supabase.from('projects').select('id, name');
  if (pError) {
    console.error('Projects Error:', JSON.stringify(pError, null, 2));
  } else {
    console.log('Projects count:', projects?.length || 0);
    if (projects && projects.length > 0) {
      console.log('First project:', projects[0].name);
    }
  }

  const { data: tasks } = await supabase.from('tasks').select('id');
  console.log('Tasks count:', tasks?.length || 0);
  
  const { data: casting } = await supabase.from('casting_profiles').select('id');
  console.log('Casting count:', casting?.length || 0);

  const { data: locations } = await supabase.from('locations').select('id');
  console.log('Locations count:', locations?.length || 0);
  
  console.log('------------------------------');
}

checkData();
