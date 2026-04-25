
-- Migration: Ensure site_assets bucket is public and has correct policies
-- Purpose: Fix 500/504 errors when fetching uploaded assets on public pages.

-- 1. Create the buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('site_assets', 'site_assets', true), ('asili-images', 'asili-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public access to read files
CREATE POLICY "Public Access Assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'site_assets' );

CREATE POLICY "Public Access Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'asili-images' );

-- 3. Allow authenticated users to upload/update/delete
CREATE POLICY "Authenticated Upload Assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id IN ('site_assets', 'asili-images') );
CREATE POLICY "Authenticated Update Assets" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id IN ('site_assets', 'asili-images') );
CREATE POLICY "Authenticated Delete Assets" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id IN ('site_assets', 'asili-images') );
