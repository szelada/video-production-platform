
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function validateWorkspace() {
  console.log('--- STARTING WORKSPACE LOGIC VALIDATION ---');
  
  // 0. Get a project and a profile to simulate a user
  const { data: project } = await supabase.from('projects').select('id, name').limit(1).single();
  const { data: profiles } = await supabase.from('profiles').select('id, full_name').limit(1);
  
  if (!project || !profiles || profiles.length === 0) {
    console.error('❌ FATAL: Need data to validate workspace.');
    return;
  }
  
  const userId = profiles[0].id;
  const projectId = project.id;
  console.log(`Simulating Workspace for User: ${profiles[0].full_name} (${userId})`);
  console.log(`Target Project: ${project.name} (${projectId})\n`);

  const report = {
    my_tasks: 'FAIL',
    my_projects: 'FAIL',
    my_activity: 'FAIL'
  };

  // 1. Validate "My Tasks" query
  console.log('1. Testing "My Tasks" query...');
  const { data: tasks, error: tErr } = await supabase
    .from('tasks')
    .select('id, title, status, projects(name)')
    .eq('assigned_to', userId);
  
  if (tErr) console.log(`   ❌ QUERY FAIL: ${tErr.message}`);
  else {
    console.log(`   ✅ QUERY PASS (Found ${tasks.length} tasks)`);
    report.my_tasks = 'PASS';
  }

  // 2. Validate "My Projects" query
  console.log('\n2. Testing "My Projects" query...');
  const { data: memberships, error: mErr } = await supabase
    .from('project_members')
    .select('project_id, roles(name), projects(*)')
    .eq('profile_id', userId);
  
  if (mErr) console.log(`   ❌ QUERY FAIL: ${mErr.message}`);
  else {
    console.log(`   ✅ QUERY PASS (Found ${memberships.length} projects)`);
    report.my_projects = 'PASS';
  }

  // 3. Validate "My Activity" query
  console.log('\n3. Testing "My Activity" query...');
  if (memberships && memberships.length > 0) {
    const projectIds = memberships.map(m => m.project_id);
    const { data: activities, error: aErr } = await supabase
      .from('project_activity')
      .select('*, projects(name)')
      .in('project_id', projectIds)
      .limit(5);
    
    if (aErr) console.log(`   ❌ QUERY FAIL: ${aErr.message}`);
    else {
      console.log(`   ✅ QUERY PASS (Found ${activities.length} activity logs)`);
      report.my_activity = 'PASS';
    }
  } else {
    console.log('   ⚠️ Skipping activity test (No project memberships found for this user)');
    report.my_activity = 'SKIP';
  }

  console.log('\n--- WORKSPACE VALIDATION SUMMARY ---');
  console.log(JSON.stringify(report, null, 2));
}

validateWorkspace();
