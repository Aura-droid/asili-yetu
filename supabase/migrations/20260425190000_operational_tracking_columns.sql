-- Migration: Operational Tracking Infrastructure
-- Adds necessary timestamp columns for mission and inquiry lifecycle tracking.

-- 1. Missions Table Extensions
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN public.missions.accepted_at IS 'The timestamp when a ranger officially accepted the mission.';
COMMENT ON COLUMN public.missions.completed_at IS 'The timestamp when the ranger finalized the mission.';

-- 2. Inquiries Table Extensions
ALTER TABLE public.inquiries 
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN public.inquiries.confirmed_at IS 'The timestamp when the explorer authorized the expedition.';
