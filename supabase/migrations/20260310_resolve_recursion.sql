-- Migration: Resolve Infinite Recursion in Projects/Members RLS
-- Date: 2026-03-10
-- Description: Drops existing policies on projects and project_members and replaces them with a simplified, non-recursive structure.

DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on projects
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'projects' AND schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY %I ON public.projects', pol.policyname);
    END LOOP;
    
    -- Drop all policies on project_members
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'project_members' AND schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY %I ON public.project_members', pol.policyname);
    END LOOP;
END $$;

-- 1. Projects Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read projects (Demo Mode)
CREATE POLICY "Allow public select" ON public.projects FOR SELECT USING (true);

-- Allow authenticated users to insert/update projects
-- This breaks the recursion by using auth metadata instead of querying linked tables
CREATE POLICY "Allow authenticated insert" ON public.projects 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON public.projects 
FOR UPDATE USING (auth.role() = 'authenticated');

-- 2. Project Members Policies
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view project members
CREATE POLICY "Allow public select members" ON public.project_members 
FOR SELECT USING (true);

-- Allow authenticated users to manage members
CREATE POLICY "Allow authenticated manage members" ON public.project_members 
FOR ALL USING (auth.role() = 'authenticated');
