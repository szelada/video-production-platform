-- Migration: Suppliers & Phase 3 Logistics
-- Date: 2026-03-10
-- Description: Creates the infrastructure for managing vendors, suppliers, and project-specific costs.

-- 1. Suppliers Table (Master List)
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT, -- e.g. 'Catering', 'Transporte', 'Equipos', 'Seguros', 'Varios'
    contact_name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'inactive', 'blacklisted'
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Project Suppliers (Link table for specific production assignments & costs)
CREATE TABLE IF NOT EXISTS public.project_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
    service_description TEXT,
    budgeted_amount DECIMAL(12,2) DEFAULT 0,
    actual_amount DECIMAL(12,2) DEFAULT 0,
    status TEXT DEFAULT 'requested', -- 'requested', 'confirmed', 'paid', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, supplier_id)
);

-- 3. Security (RLS)
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_suppliers ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users to view
CREATE POLICY "Everyone can view suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Everyone can view project_suppliers" ON public.project_suppliers FOR SELECT USING (true);

-- Allow admins/producers to manage (simple check for now, can be refined based on roles)
CREATE POLICY "Authenticated users can insert suppliers" ON public.suppliers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_suppliers_updated_at') THEN
        CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_suppliers_updated_at') THEN
        CREATE TRIGGER update_project_suppliers_updated_at BEFORE UPDATE ON public.project_suppliers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;
