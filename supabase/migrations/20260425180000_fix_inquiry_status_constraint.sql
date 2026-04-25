-- Migration: Normalizing Inquiry Workflow Status
-- Drops the legacy check constraint that may be restricting the status values.
-- Ensures 'confirmed' is a valid state for the expedition lifecycle.

DO $$ 
BEGIN
    -- 1. Try to drop the check constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'inquiries' AND constraint_name = 'inquiries_status_check'
    ) THEN
        ALTER TABLE public.inquiries DROP CONSTRAINT inquiries_status_check;
    END IF;

    -- 2. Ensure the ENUM type exists and includes all necessary states
    -- Note: Postgres doesn't support IF NOT EXISTS for ENUM values easily, 
    -- so we use a safety block.
    BEGIN
        ALTER TYPE inquiry_status ADD VALUE 'confirmed';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;

END $$;
