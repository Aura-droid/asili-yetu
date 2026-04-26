-- Migration: Package Inclusions Engine
-- Adds a structured inclusions column to the packages table for high-fidelity service display.

ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS inclusions JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.packages.inclusions IS 'Structured list of service inclusions with metadata for visual rendering.';
