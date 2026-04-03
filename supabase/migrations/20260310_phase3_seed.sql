-- Migration: Add Photo Columns and Seed Demo Data (Phase 3)
-- Date: 2026-03-10

-- 1. Add Photo Columns to existing tables
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'casting_profiles' AND COLUMN_NAME = 'photo_url') THEN
        ALTER TABLE public.casting_profiles ADD COLUMN photo_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'locations' AND COLUMN_NAME = 'main_photo_url') THEN
        ALTER TABLE public.locations ADD COLUMN main_photo_url TEXT;
    END IF;
END $$;

-- 2. Seed Suppliers Data
INSERT INTO public.suppliers (name, category, contact_name, phone, email, website, address, rating)
VALUES 
    ('Catering Gourmet S.A.', 'Catering', 'Juan Perez', '+51 987 654 321', 'contacto@gourmet.com', 'www.gourmet.com', 'Av. Larco 123, Miraflores', 5),
    ('Transportes Cine', 'Transporte', 'Maria Garcia', '+51 912 345 678', 'logistica@transcine.com', NULL, 'Chorrillos, Lima', 4),
    ('Rentals Pro Lima', 'Equipos', 'Carlos Ruiz', '+51 999 888 777', 'ventas@rentalspro.pe', 'www.rentalspro.pe', 'Surquillo', 5),
    ('Seguros Producción', 'Seguros', 'Elena Torres', '+51 944 555 666', 'etorres@seguros.com', NULL, 'San Isidro', 4),
    ('Hoteles del Sol', 'Varios', 'Ricardo Palma', '+51 933 222 111', 'rpalma@hotelessol.com', 'www.hotelessol.com', 'Punta Hermosa', 3)
ON CONFLICT DO NOTHING;

-- 3. Update Existing Profiles/Locations with Placeholder Photos (Unsplash)
UPDATE public.casting_profiles SET photo_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300' WHERE full_name = 'Marcos Valdivia';
UPDATE public.casting_profiles SET photo_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300' WHERE full_name = 'Elena Rivas';
UPDATE public.casting_profiles SET photo_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300' WHERE full_name = 'Sofia Beltrán';
UPDATE public.casting_profiles SET photo_url = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300' WHERE full_name = 'Daniela Torres';

UPDATE public.locations SET main_photo_url = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800&h=450' WHERE name = 'Estadio Nacional';
UPDATE public.locations SET main_photo_url = 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=800&h=450' WHERE name = 'Valle Sagrado';
UPDATE public.locations SET main_photo_url = 'https://images.unsplash.com/photo-1513584684374-8bdb7489feef?auto=format&fit=crop&q=80&w=800&h=450' WHERE name = 'Loft Industrial Chorrillos';
UPDATE public.locations SET main_photo_url = 'https://images.unsplash.com/photo-1500043204644-79177122b332?auto=format&fit=crop&q=80&w=800&h=450' WHERE name = 'Puerto Maldonado Lodge';
