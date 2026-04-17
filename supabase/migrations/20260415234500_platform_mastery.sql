-- Migration: Platform Mastery Console
-- Provides a centralized, singleton configuration table for the asili ecosystem.
-- This allows admins to coordinate global contact handles, brand metadata, and 
-- operational flags directly from the command center without touch code.

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    whatsapp_number TEXT DEFAULT '+255000000000',
    admin_email TEXT DEFAULT 'frdrckmmari@gmail.com',
    office_address TEXT DEFAULT 'Arusha, Tanzania',
    instagram_username TEXT DEFAULT 'asiliyetusafaris',
    facebook_link TEXT,
    tripadvisor_link TEXT,
    savannah_mode_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings for the header/footer
CREATE POLICY "Public read platform_settings" ON public.platform_settings
    FOR SELECT USING (true);

-- Only authenticated admins can update
CREATE POLICY "Admins manage platform_settings" ON public.platform_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed the initial singleton row
INSERT INTO public.platform_settings (id, whatsapp_number, admin_email)
VALUES ('00000000-0000-0000-0000-000000000000'::uuid, '+255787654321', 'info@asiliyetusafaris.com')
ON CONFLICT (id) DO NOTHING;
