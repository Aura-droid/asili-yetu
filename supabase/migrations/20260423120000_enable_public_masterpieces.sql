-- Migration: Ensure public readability for Masterpiece sections
-- Added at: 2026-04-23

-- 1. Packages public read
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read packages" ON public.packages;
CREATE POLICY "Public read packages" ON public.packages
    FOR SELECT USING (true);

-- 2. Destinations public read
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read destinations" ON public.destinations;
CREATE POLICY "Public read destinations" ON public.destinations
    FOR SELECT USING (true);

-- 3. Culture Stories public read
ALTER TABLE public.culture_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read culture_stories" ON public.culture_stories;
CREATE POLICY "Public read culture_stories" ON public.culture_stories
    FOR SELECT USING (true);

-- 4. Gallery Items public read
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read gallery_items" ON public.gallery_items;
CREATE POLICY "Public read gallery_items" ON public.gallery_items
    FOR SELECT USING (true);
