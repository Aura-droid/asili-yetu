-- Migration: Add package_tier to packages table
-- This supports categorizing packages into budget, mid_range, and luxury tiers.

ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS package_tier text DEFAULT 'mid_range';

-- Optionally, you can add a check constraint to ensure only valid tiers are used
-- ALTER TABLE packages ADD CONSTRAINT packages_package_tier_check CHECK (package_tier IN ('budget', 'mid_range', 'luxury'));
