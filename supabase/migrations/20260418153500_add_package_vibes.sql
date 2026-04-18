-- Migration: Add Vibe and Temperature context to Packages
-- Allows for orientation based on "feel" rather than just location.

ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS biome_orientation TEXT DEFAULT 'Savannah',
ADD COLUMN IF NOT EXISTS temperature_profile TEXT DEFAULT 'Warm & Sun-drenched',
ADD COLUMN IF NOT EXISTS intensity_vibe TEXT DEFAULT 'Classic Safari';
