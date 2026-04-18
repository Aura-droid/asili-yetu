-- Migration: Audience Lifecycle Grid
-- Captures traveler interest and builds the "Great Migration" newsletter registry.
-- This creates the bedrock for your recurring audience engagement and future 
-- expedition reveals across all supported regions.

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    locale TEXT DEFAULT 'en',
    status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'footer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view and manage the audience registry
DROP POLICY IF EXISTS "Admins manage newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Admins manage newsletter subscriptions" ON public.newsletter_subscriptions
    FOR ALL USING (auth.role() = 'authenticated');

-- Anyone can subscribe
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- Enable Realtime for the audience lifecycle grid (Idempotent check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'newsletter_subscriptions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE newsletter_subscriptions;
  END IF;
END $$;

COMMENT ON TABLE public.newsletter_subscriptions IS 'Registry for traveler email capture and lifecycle marketing.';
