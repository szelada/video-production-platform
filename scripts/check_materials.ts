import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkMaterials() {
  const { data, error } = await supabase
    .from('project_materials')
    .select('*')
    .limit(5);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Sample Materials:');
  data.forEach(m => {
    console.log(`- ID: ${m.id}, Type: ${m.type}, Name: ${m.file_name}, URL: ${m.file_url}`);
  });
}

checkMaterials();
