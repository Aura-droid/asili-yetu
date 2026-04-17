-- Migration: Geospatial Intelligence
-- Adds coordinates to the destinations system to power the Mapbox Interactive Explorer.

ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(9, 6),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(9, 6);

-- Seed Coordinates for the core "High-Fidelity" destinations
UPDATE public.destinations SET latitude = -2.3333, longitude = 34.8333 WHERE name = 'Serengeti National Park';
UPDATE public.destinations SET latitude = -3.2442, longitude = 35.5862 WHERE name = 'Ngorongoro Crater';
UPDATE public.destinations SET latitude = -3.9531, longitude = 35.9619 WHERE name = 'Tarangire National Park';
UPDATE public.destinations SET latitude = -3.0674, longitude = 37.3556 WHERE name = 'Mount Kilimanjaro';

COMMENT ON COLUMN public.destinations.latitude IS 'Geographic latitude for Mapbox visualization.';
COMMENT ON COLUMN public.destinations.longitude IS 'Geographic longitude for Mapbox visualization.';
