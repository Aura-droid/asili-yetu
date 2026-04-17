-- Migration: Create Global Settings Table
-- Purpose: Support the Command Center Helm UI with a dedicated singleton row.

CREATE TABLE IF NOT EXISTS public.settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    site_name TEXT DEFAULT 'Asili Yetu Safaris',
    contact_email TEXT DEFAULT 'info@asiliyetusafaris.com',
    contact_phone TEXT DEFAULT '+255000000000',
    whatsapp_number TEXT DEFAULT '+255000000000',
    instagram_url TEXT,
    facebook_url TEXT,
    office_location TEXT DEFAULT 'Arusha, Tanzania',
    is_maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read settings" ON public.settings
    FOR SELECT USING (true);

-- Admin management access
CREATE POLICY "Admins manage settings" ON public.settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed the initial row with ID 1 to match the code (.eq("id", 1))
INSERT INTO public.settings (site_name)
VALUES ('Asili Yetu Safaris')
ON CONFLICT DO NOTHING;
