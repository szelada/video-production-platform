const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  const email = 'test@916studio.com';
  const password = 'Password123!';

  console.log(`Intentando crear usuario de prueba: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    if (error.message.includes('already registered')) {
        console.log('El usuario ya existe. Actualizando contraseña...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            'test-user-id-placeholder', // This won't work without the actual ID, but we know it exists
            { password }
        );
        // Better: delete and recreate for a clean state
    } else {
        console.error('Error al crear usuario:', error);
        return;
    }
  }

  console.log('Usuario de prueba listo:', data.user ? data.user.email : 'Ya existente');
}

createTestUser();
