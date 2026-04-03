import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'Falta projectId' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('project_members')
            .select(`
        id,
        joined_at,
        profile_id,
        role_id,
        profiles!project_members_profile_id_fkey (id, full_name, avatar_url),
        roles (id, name, description)
      `)
            .eq('project_id', projectId);

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { project_id, profile_id, role_id } = await req.json();

        if (!project_id || !profile_id || !role_id) {
            return NextResponse.json({ error: 'Faltan parámetros requeridos (project_id, profile_id, role_id)' }, { status: 400 });
        }

        // Usar supabaseAdmin para bypassear RLS
        const { data, error } = await supabaseAdmin
            .from('project_members')
            .insert([{
                project_id,
                profile_id,
                role_id,
                joined_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('Supabase Admin Insert Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, member: data[0] });
    } catch (err: any) {
        console.error('API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
