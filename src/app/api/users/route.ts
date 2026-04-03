import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const getAdminClient = () => {
    if (!supabaseServiceKey) throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY');
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
};

export async function POST(request: Request) {
    try {
        const { email, password, full_name } = await request.json();
        const supabaseAdmin = getAdminClient();

        const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name }
        });

        if (authError) throw authError;
        return NextResponse.json({ user, message: 'Usuario creado exitosamente.' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, full_name, default_role_id, is_active } = await request.json();
        const supabaseAdmin = getAdminClient();

        // Update profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ full_name, default_role_id, is_active })
            .eq('id', id);

        if (profileError) throw profileError;

        // Optionally update auth user metadata
        if (full_name) {
            await supabaseAdmin.auth.admin.updateUserById(id, { user_metadata: { full_name } });
        }

        return NextResponse.json({ message: 'Usuario actualizado exitosamente.' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) throw new Error('ID requerido');

        const supabaseAdmin = getAdminClient();

        // This completely deletes the user from Auth, cascading to profiles
        const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
        if (error) throw error;

        return NextResponse.json({ message: 'Usuario eliminado exitosamente.' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
