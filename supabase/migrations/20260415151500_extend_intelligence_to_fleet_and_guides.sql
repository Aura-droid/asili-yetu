-- Migration: Deep Intelligence Infrastructure
-- Extends the multi-lingual auto-translation engine to the human roster 
-- and the operational fleet for high-fidelity global synchronization.

ALTER TABLE public.guides 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.guides.translations IS 'AI-generated translations for bio, role, and specialty.';
COMMENT ON COLUMN public.vehicles.translations IS 'AI-generated translations for model name and feature list.';
