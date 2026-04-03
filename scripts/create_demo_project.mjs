import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual .env.local parsing
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => {
      const [key, ...val] = line.split('=');
      return [key.trim(), val.join('=').trim()];
    })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log('📦 Configurando Storage Buckets...');
  const buckets = ['project-materials', 'project_media'];
  for (const b of buckets) {
    const { data, error } = await supabase.storage.createBucket(b, {
      public: true,
      allowedMimeTypes: ['application/pdf', 'image/*', 'text/plain'],
      fileSizeLimit: 52428800 // 50MB
    });
    if (error && error.message !== 'Bucket already exists') {
      console.error(`Error creando bucket ${b}:`, error.message);
    } else {
      console.log(`✅ Bucket ${b} listo.`);
    }
  }
}

async function createDemoProject() {
  console.log('🚀 Iniciando creación de Proyecto Demo...');
  await setupStorage();

  // 1. Create Project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([
      {
        name: 'PROYECTO AUDITORÍA REAL',
        code: `AUD-2024-DEMO-${Date.now().toString().slice(-4)}`,
        client_name: 'Antigravity Studio',
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      }
    ])
    .select()
    .single();

  if (projectError) {
    console.error('Error creando proyecto:', projectError);
    return;
  }

  const projectId = project.id;
  console.log(`✅ Proyecto creado: ${project.name} (${projectId})`);

  // 2. Add Materials (Script)
  const { error: materialError } = await supabase
    .from('project_materials')
    .insert([
      {
        project_id: projectId,
        type: 'script',
        file_name: 'GUION_DEMO_V1.pdf',
        file_url: 'https://oklolzzseflhgucvfhef.supabase.co/storage/v1/object/public/project-materials/demo/script.pdf',
        version: 1,
        notes: 'Guion base para auditoría de IA'
      }
    ]);

  if (materialError) console.error('Error añadiendo materiales:', materialError);
  else console.log('✅ Materiales añadidos.');

  // 3. Add Tasks
  const { error: tasksError } = await supabase
    .from('tasks')
    .insert([
      { project_id: projectId, title: 'Scouting de Locación Parque', status: 'done', priority: 'high', area: 'producción' },
      { project_id: projectId, title: 'Casting de Personaje Principal', status: 'in_progress', priority: 'medium', area: 'dirección' },
      { project_id: projectId, title: 'Presupuesto de Arte', status: 'todo', priority: 'high', area: 'producción' }
    ]);

  if (tasksError) console.error('Error añadiendo tareas:', tasksError);
  else console.log('✅ Tareas iniciales creadas.');

  // 4. Add Activity
  await supabase.from('project_activity').insert([
    { project_id: projectId, action: 'project_created', description: 'Sistema iniciado para auditoría real' },
    { project_id: projectId, action: 'material_uploaded', description: 'Guion cargado correctamente' }
  ]);

  console.log('✨ Proyecto Demo listo para auditoría.');
  console.log(`URL sugerida: /projects/${projectId}`);
}

createDemoProject();
