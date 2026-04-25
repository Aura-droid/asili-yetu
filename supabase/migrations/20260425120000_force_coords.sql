
-- Migration: Force Update Core Destination Coordinates
-- Purpose: Ensure the core destinations have their Mapbox coordinates in the production database.

UPDATE public.destinations 
SET latitude = -2.3333, longitude = 34.8333 
WHERE name ILIKE '%Serengeti%';

UPDATE public.destinations 
SET latitude = -3.2442, longitude = 35.5862 
WHERE name ILIKE '%Ngorongoro%';

UPDATE public.destinations 
SET latitude = -3.9531, longitude = 35.9619 
WHERE name ILIKE '%Tarangire%';

UPDATE public.destinations 
SET latitude = -3.0674, longitude = 37.3556 
WHERE name ILIKE '%Kilimanjaro%';

UPDATE public.destinations 
SET latitude = -6.1659, longitude = 39.2026 
WHERE name ILIKE '%Zanzibar%';
