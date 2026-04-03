-- Migration: Setup Storage for Photos
-- Date: 2026-03-10

-- 1. Create a public bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_media', 'project_media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS Policies for Storage
-- Allow anyone to read
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project_media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project_media' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their own
CREATE POLICY "Authenticated Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'project_media' AND auth.role() = 'authenticated');
