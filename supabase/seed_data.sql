-- Seed Data: Platform Demo (Unified & Normalized)
-- Date: 2026-03-10
-- Description: Inserts realistic demo data respecting the normalized schema (linking tables).

DO $$ 
DECLARE 
    -- Project IDs
    p_nike UUID := uuid_generate_v4();
    p_inca UUID := uuid_generate_v4();
    p_vogue UUID := uuid_generate_v4();
    p_forest UUID := uuid_generate_v4();
    p_coke UUID := uuid_generate_v4();

    -- Casting Profile IDs
    c_marcos UUID := uuid_generate_v4();
    c_elena UUID := uuid_generate_v4();
    c_sofia UUID := uuid_generate_v4();
    c_mateo UUID := uuid_generate_v4();
    c_daniela UUID := uuid_generate_v4();
    c_lucia UUID := uuid_generate_v4();

    -- Location IDs
    l_estadio UUID := uuid_generate_v4();
    l_valle UUID := uuid_generate_v4();
    l_loft UUID := uuid_generate_v4();
    l_lodge UUID := uuid_generate_v4();

BEGIN 
    -- 1. PROJECTS
    INSERT INTO public.projects (id, name, code, description, client_name, project_type, status, start_date, end_date)
    VALUES 
        (p_nike, 'Nike: Beyond Limits', 'NIKE-BL-01', 'Campaña publicitaria de calzado deportivo.', 'Nike Global', 'Comercial', 'active', '2024-03-15', '2024-04-20'),
        (p_inca, 'Secretos del Inca', 'INC-S1', 'Serie documental premium sobre el imperio Inca.', 'Netflix', 'TV Series', 'draft', '2024-06-01', '2024-12-15'),
        (p_vogue, 'VOGUE Fall Edition', 'VG-FALL-24', 'Fashion film para temporada otoño.', 'Vogue Editorial', 'Fashion Film', 'active', '2024-03-01', '2024-03-30'),
        (p_forest, 'Guardianes del Bosque', 'DOC-FOR-01', 'Documental sobre conservación en Amazonía.', 'National Geographic', 'Documentary', 'completed', '2023-11-10', '2024-01-20'),
        (p_coke, 'Campaña Navidad 2024', 'COKE-XMAS', 'Relanzamiento de marca navideño.', 'Coca-Cola', 'Comercial', 'draft', '2024-09-01', '2024-12-24')
    ON CONFLICT (code) DO NOTHING;

    -- 2. CASTING PROFILES (Independent of projects)
    INSERT INTO public.casting_profiles (id, full_name, age_range, height_cm, city, skills)
    VALUES 
        (c_marcos, 'Marcos Valdivia', '25-30', 185, 'Lima', 'Atletismo, Salto largo'),
        (c_elena, 'Elena Rivas', '20-25', 170, 'Cusco', 'Parkour, Danza'),
        (c_sofia, 'Sofia Beltrán', '18-24', 178, 'Madrid', 'Pasarela, Francés'),
        (c_mateo, 'Mateo Inca', '40-50', 165, 'Puno', 'Actuación, Quechua'),
        (c_daniela, 'Daniela Torres', '30-35', 168, 'Arequipa', 'Locución, Canto'),
        (c_lucia, 'Lucia Sanz', '22-28', 175, 'Buenos Aires', 'Alta costura');

    -- 3. LINK CASTING TO PROJECTS (casting_project_status)
    INSERT INTO public.casting_project_status (project_id, casting_profile_id, status)
    VALUES 
        (p_nike, c_marcos, 'shortlisted'),
        (p_nike, c_elena, 'approved'),
        (p_vogue, c_sofia, 'approved'),
        (p_inca, c_mateo, 'new'),
        (p_coke, c_daniela, 'shortlisted'),
        (p_vogue, c_lucia, 'shortlisted')
    ON CONFLICT DO NOTHING;

    -- 4. LOCATIONS (Independent of projects)
    INSERT INTO public.locations (id, name, location_type, city, address, owner_name)
    VALUES 
        (l_estadio, 'Estadio Nacional', 'Exterior', 'Lima', 'Av. Paseo de la República', 'IPD'),
        (l_valle, 'Valle Sagrado', 'Exterior', 'Cusco', 'Urubamba', 'Comunidad Local'),
        (l_loft, 'Loft Industrial Chorrillos', 'Interior', 'Lima', 'Calle Malecón Graú', 'Privado'),
        (l_lodge, 'Puerto Maldonado Lodge', 'Exterior', 'Madre de Dios', 'Río Tambopata', 'Ecolodge S.A.');

    -- 5. LINK LOCATIONS TO PROJECTS (location_project_status)
    INSERT INTO public.location_project_status (project_id, location_id, status)
    VALUES 
        (p_nike, l_estadio, 'approved'),
        (p_inca, l_valle, 'visited'),
        (p_vogue, l_loft, 'reserved'),
        (p_forest, l_lodge, 'approved')
    ON CONFLICT DO NOTHING;

    -- 6. TASKS
    INSERT INTO public.tasks (project_id, title, description, priority, status, due_date)
    VALUES 
        (p_nike, 'Scouting de pista de atletismo', 'Luz controlada.', 'high', 'completed', '2024-03-20'),
        (p_nike, 'Alquiler de Alexa 35', 'Kit anamórfico.', 'high', 'pending', '2024-04-10'),
        (p_inca, 'Escritura de guion', 'Revisión final.', 'medium', 'in_progress', '2024-05-15'),
        (p_inca, 'Permisos Machu Picchu', 'Uso de drones.', 'high', 'pending', '2024-07-20'),
        (p_vogue, 'Moodboard de vestuario', 'Aprobación cliente.', 'medium', 'completed', '2024-03-05'),
        (p_vogue, 'Reserva de estudio', '2 días de rodaje.', 'high', 'in_progress', '2024-03-25'),
        (p_forest, 'Edición de color', 'Estética cine.', 'low', 'completed', '2024-01-15'),
        (p_forest, 'Sonido 5.1', 'Limpieza audios.', 'medium', 'completed', '2024-01-20'),
        (p_coke, 'Logística crew', 'Transporte Navidad.', 'medium', 'pending', '2024-10-15'),
        (p_nike, 'Casting atletas', '3 perfiles pro.', 'high', 'in_progress', '2024-04-01');

END $$;
