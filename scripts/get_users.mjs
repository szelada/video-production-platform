const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzExOTI1OCwiZXhwIjoyMDg4Njk1MjU4fQ.oVUhRCH0M9Z1qVoATRPairZzmcx8lACVYOpvD-I4PHI';

async function getUsers() {
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=full_name,email`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

getUsers();
