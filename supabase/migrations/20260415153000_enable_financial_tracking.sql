-- Migration: Business Intelligence Suite
-- Adds financial tracking to the inquiries system to enable real-time ROI analysis.

ALTER TABLE public.inquiries 
ADD COLUMN IF NOT EXISTS quoted_price DECIMAL(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

COMMENT ON COLUMN public.inquiries.quoted_price IS 'The final agreed price for the safari expedition used for ROI tracking.';
