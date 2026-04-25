-- Migration: Finalizing Expedition Lifecycle
-- Adds a timestamp for when a client officially authorizes their safari expedition.

ALTER TABLE public.inquiries 
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN public.inquiries.confirmed_at IS 'The timestamp when the explorer officially authorized the expedition from their terminal.';
