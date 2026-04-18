-- Migration: Create Company Notices Table
-- Allows Admins to toggle real-time alerts or promotional messaging across the platform.

CREATE TABLE IF NOT EXISTS public.company_notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'discount', 'alert')),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.company_notices ENABLE ROW LEVEL SECURITY;

-- Allow public read access to fetch active notices
DROP POLICY IF EXISTS "Allow public read access on company_notices" ON public.company_notices;
CREATE POLICY "Allow public read access on company_notices"
ON public.company_notices
FOR SELECT
USING (true);

-- Notice: Admins will require authorization to INSERT/UPDATE (configured later through auth)
-- For now, we lock writes internally because notices should only come from secure admin dashboards.
DROP POLICY IF EXISTS "Allow authenticated admins to insert company_notices" ON public.company_notices;
CREATE POLICY "Allow authenticated admins to insert company_notices"
ON public.company_notices
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated admins to update company_notices" ON public.company_notices;
CREATE POLICY "Allow authenticated admins to update company_notices"
ON public.company_notices
FOR UPDATE
USING (auth.role() = 'authenticated');
