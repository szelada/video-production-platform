
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function probeData() {
  console.log('--- PROBING DATA FOR WORKSPACE VALIDATION ---');
  
  const { data: tasks, error: tErr } = await supabase.from('tasks').select('id, title, assigned_to, project_id').limit(5);
  console.log(`Tasks sample found: ${tasks?.length || 0}`);
  if (tasks) tasks.forEach(t => console.log(` - Task: ${t.title}, AssignedTo: ${t.assigned_to}`));

  const { data: projects, error: pErr } = await supabase.from('projects').select('id, name').limit(5);
  console.log(`Projects found: ${projects?.length || 0}`);

  const { data: activities, error: aErr } = await supabase.from('project_activity').select('id, action, project_id').limit(5);
  console.log(`Activities found: ${activities?.length || 0}`);
}

probeData();
