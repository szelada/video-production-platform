const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:postgres@localhost:54322/postgres';

async function runMigration() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database');
    
    const migrationPath = 'e:\\WEBS y APPS Antigravity\\video-production-platform\\supabase\\migrations\\20260312000008_production_logistics_call_sheets.sql';
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executing migration...');
    await client.query(sql);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Error executing migration:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
