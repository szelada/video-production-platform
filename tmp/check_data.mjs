import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Error: API Keys missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('--- Checking Supabase Data ---');
  
  const { data: projects, error: pError } = await supabase.from('projects').select('id, name');
  console.log('Projects count:', projects?.length || 0);
  if (pError) console.error('Projects Error:', pError.message);

  const { data: tasks, error: tError } = await supabase.from('tasks').select('id');
  console.log('Tasks count:', tasks?.length || 0);
  
  const { data: casting, error: cError } = await supabase.from('casting_profiles').select('id');
  console.log('Casting count:', casting?.length || 0);

  const { data: locations, error: lError } = await supabase.from('locations').select('id');
  console.log('Locations count:', locations?.length || 0);
  
  console.log('------------------------------');
}

checkData();
