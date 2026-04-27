-- Migration: Add capacity fields to packages
ALTER TABLE packages ADD COLUMN IF NOT EXISTS max_people INTEGER DEFAULT 8;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS people_count_text TEXT DEFAULT 'For 2-8 People';

COMMENT ON COLUMN packages.max_people IS 'Maximum number of people allowed for this package';
COMMENT ON COLUMN packages.people_count_text IS 'Display text for the capacity (e.g., "For 2-6 People")';
