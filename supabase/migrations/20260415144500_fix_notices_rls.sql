-- Migration: Fix Notices RLS for Development
-- The previous migration restricted inserts to authenticated users.
-- Since we are in development and using a secure admin route but not 
-- necessarily Supabase Auth, we temporarily allow anon inserts/updates 
-- for the company_notices table.

DROP POLICY IF EXISTS "Allow authenticated admins to insert company_notices" ON public.company_notices;
DROP POLICY IF EXISTS "Allow authenticated admins to update company_notices" ON public.company_notices;

CREATE POLICY "Allow anyone to insert company_notices"
ON public.company_notices
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anyone to update company_notices"
ON public.company_notices
FOR UPDATE
USING (true);
