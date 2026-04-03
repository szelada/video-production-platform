-- Seed Profiles for Demo
-- Date: 2026-03-11

INSERT INTO public.profiles (id, full_name, avatar_url)
VALUES 
    (gen_random_uuid(), 'Carlos Productor', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos'),
    (gen_random_uuid(), 'Ana Directora', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana'),
    (gen_random_uuid(), 'Luis Sonido', 'https://api.dicebear.com/7.x/avataaars/svg?seed=luis')
ON CONFLICT DO NOTHING;
