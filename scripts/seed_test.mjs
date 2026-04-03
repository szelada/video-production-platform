
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('--- SEEDING TEST DATA ---');
  
  // 1. Get or Create Profile
  // Since we don't have auth access here, we'll try to find any profile or create a dummy if RLS allows (it's Ultra Grant)
  let { data: profile } = await supabase.from('profiles').select('id').limit(1).single();
  
  if (!profile) {
    console.log('No profiles found. Creating a test profile...');
    // We need a UUID from auth.users technically if there's a FK, but if Ultra Grant is active on profiles too...
    // Let's check schema for profiles. 
    // Usually profiles.id references auth.users(id). 
    // If we can't create an auth user, we might be stuck UNLESS we find an existing one.
    console.log('Searching for any user in auth.users is not possible via anon key.');
    console.log('Try to insert a random UUID into profiles assuming it might not have the FK check active in development or it allows manual inserts.');
    const dummyId = '00000000-0000-0000-0000-000000000000';
    const { data: newProf, error: pErr } = await supabase.from('profiles').insert([
        { id: dummyId, full_name: 'Test Auditor' }
    ]).select().single();
    if (pErr) console.log(`Could not create profile: ${pErr.message}`);
    else profile = newProf;
  }

  // 2. Get or Create Project
  let { data: project } = await supabase.from('projects').select('id').limit(1).single();
  if (!project && profile) {
    console.log('No projects found. Creating a test project...');
    const { data: newProj, error: prErr } = await supabase.from('projects').insert([
        { name: 'Stability Test Project', client: 'Internal', code: 'TEST-001', created_by: profile.id }
    ]).select().single();
    if (prErr) console.log(`Could not create project: ${prErr.message}`);
    else project = newProj;
  }

  if (project && profile) {
    console.log('✅ DATABASE READY FOR VALIDATION');
    console.log(`Project: ${project.id}`);
    console.log(`Profile: ${profile.id}`);
  } else {
    console.log('❌ DATABASE NOT READY');
  }
}

seed();
