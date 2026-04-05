import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkProfiles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .limit(10);

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log('--- EXISTentes EN PROFILES ---');
  console.table(data);
}

checkProfiles();
