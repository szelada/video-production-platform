-- Migration: Sync schema with frontend (Casting, Locations, and Crew)
-- Date: 2026-03-10
-- Description: Adds project_id to casting and locations, items roles table and project_members for crew management.

-- 1. ADAPT EXISTING TABLES
ALTER TABLE public.casting_profiles 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

ALTER TABLE public.locations 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- 2. CREATE ROLES INFRASTRUCTURE
-- If table exists with a 'key' column, we adapt to it.
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure 'key' column exists if it was missing or required
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS "key" TEXT;

-- Ensure UNIQUE constraint exists on roles.key (preferring key over name if it exists)
DO $$ 
BEGIN 
    -- Try to add unique to 'key' first
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'roles_key_key' AND conrelid = 'public.roles'::regclass) THEN
        ALTER TABLE public.roles ADD CONSTRAINT roles_key_key UNIQUE ("key");
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Fallback to name if key fails
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'roles_name_key' AND conrelid = 'public.roles'::regclass) THEN
        ALTER TABLE public.roles ADD CONSTRAINT roles_name_key UNIQUE (name);
    END IF;
END $$;

-- Seed basic roles safely providing both name and key
INSERT INTO public.roles ("key", name, description)
VALUES 
    ('director', 'Director', 'Responsable de la visión creativa'),
    ('productor', 'Productor', 'Gestión de recursos y logística'),
    ('dp', 'DP', 'Director de Fotografía'),
    ('sonido', 'Sonido', 'Ingeniero de sonido'),
    ('gaffer', 'Gaffer', 'Jefe de iluminación'),
    ('arte', 'Arte', 'Director de arte / Escenografía')
ON CONFLICT ("key") DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description
WHERE public.roles."key" = EXCLUDED."key";

-- 3. CREATE PROJECT CREW (project_members)
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, profile_id)
);

-- 4. SECURITY & RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Policies for roles
DROP POLICY IF EXISTS "Everyone can view roles" ON public.roles;
CREATE POLICY "Everyone can view roles" ON public.roles FOR SELECT USING (true);

-- Policies for project_members
DROP POLICY IF EXISTS "Members are viewable by everyone in the project" ON public.project_members;
CREATE POLICY "Members are viewable by everyone in the project" 
ON public.project_members FOR SELECT 
USING (true); 

DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;
CREATE POLICY "Project owners can manage members" 
ON public.project_members FOR ALL 
USING (auth.uid() IN (
    SELECT created_by FROM public.projects WHERE id = project_id
));
