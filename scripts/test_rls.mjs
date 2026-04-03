import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkRLS() {
  const { data, error } = await supabase.rpc('get_rls_status', { table_name: 'projects' });
  
  if (error) {
    // Fallback if RPC doesn't exist: check pg_tables
    console.log('RPC get_rls_status not found, checking pg_tables...');
    const { data: tableData, error: tableError } = await supabase.rpc('inspect_table_rls', { t_name: 'projects' });
    
    if (tableError) {
        // Simple SQL query via raw query if possible or just try to insert with anon key
        console.error('Failed to inspect RLS:', tableError);
        console.log('Attempting to check via direct SQL info...');
        
        const { data: rawData, error: rawError } = await supabase.from('projects').select('id').limit(1);
        console.log('Select test:', { data: rawData, error: rawError });
    } else {
        console.log('RLS Status (RPC):', tableData);
    }
  } else {
    console.log('RLS Status:', data);
  }
}

// Since I don't know the RPCs, I'll use a more direct approach: check if I can insert with ANON key
async function testAnonInsert() {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const anonClient = createClient(supabaseUrl, anonKey);
    
    console.log('Testing INSERT with ANON key...');
    const { data, error } = await anonClient.from('projects').insert([{
        name: 'RLS TEST PROJECT',
        code: 'TEST-' + Math.floor(Math.random() * 1000),
        client_name: 'TEST CLIENT',
        type: 'Comercial',
        status: 'pre-pro'
    }]).select();
    
    if (error) {
        console.error('Anon Insert Failed:', error.message);
        if (error.message.includes('row-level security')) {
            console.log('CONFIRMED: RLS is blocking inserts for anon users.');
        }
    } else {
        console.log('Anon Insert Succeeded! RLS is NOT blocking anon inserts.');
        // Cleanup
        await supabase.from('projects').delete().eq('id', data[0].id);
    }
}

testAnonInsert();
