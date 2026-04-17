-- Migration: Multi-Lingual Intelligence Suite
-- Upgrades the core content tables to support high-fidelity translations 
-- using JSONB structures for infinite language scalability.

ALTER TABLE public.company_notices 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.company_notices.translations IS 'Holds localized versions of the message (e.g., {"es": "...", "sw": "..."})';
