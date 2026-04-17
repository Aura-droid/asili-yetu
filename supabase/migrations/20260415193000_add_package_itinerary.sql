-- Add itinerary column to packages
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;
