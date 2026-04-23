-- Migration: Add Masterpiece (Featured) Toggles to interesting parts
-- Added at: 2026-04-23

-- Ensure destinations has is_featured
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Ensure culture_stories has is_featured
ALTER TABLE public.culture_stories ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Ensure gallery_items has is_featured
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Ensure packages has is_featured (should already exist)
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
