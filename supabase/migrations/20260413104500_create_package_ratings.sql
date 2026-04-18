-- Migration: Create Package Ratings Table
-- This establishes the relational structure for user reviews connected to safaris.

CREATE TABLE IF NOT EXISTS public.package_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    user_name TEXT,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.package_ratings ENABLE ROW LEVEL SECURITY;

-- Allow public read access so any visitor can see reviews
DROP POLICY IF EXISTS "Allow public read access on package_ratings" ON public.package_ratings;
CREATE POLICY "Allow public read access on package_ratings"
ON public.package_ratings
FOR SELECT
USING (true);

-- Allow anonymous inserts for demonstration (you can change this to authenticated users only later)
DROP POLICY IF EXISTS "Allow public insert on package_ratings" ON public.package_ratings;
CREATE POLICY "Allow public insert on package_ratings"
ON public.package_ratings
FOR INSERT
WITH CHECK (true);
