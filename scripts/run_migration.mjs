import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzExOTI1OCwiZXhwIjoyMDg4Njk1MjU4fQ.oVUhRCH0M9Z1qVoATRPairZzmcx8lACVYOpvD-I4PHI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    const sql = fs.readFileSync('../supabase/migrations/20260330000000_preproduction_fix.sql', 'utf8');
    
    console.log('Applying migration via RPC...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
        console.error('Migration failed:', error.message);
        if (error.message.includes('function "exec_sql" does not exist')) {
            console.warn('RPC exec_sql NOT FOUND. You must apply the migration manually in Supabase Dashboard.');
        }
    } else {
        console.log('Migration applied successfully!', data);
    }
}

runMigration();
