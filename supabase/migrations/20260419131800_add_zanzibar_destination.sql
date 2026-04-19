-- Migration: Add Zanzibar Destination
-- Adds Zanzibar to the destinations system with geospatial coordinates.

INSERT INTO public.destinations (name, type, image_url, description, best_time, key_wildlife, size, latitude, longitude)
VALUES (
  'Zanzibar Archipelago', 
  'Tropical Paradise', 
  '/destinations/zanzibar-1.jpg', 
  'The Spice Island of the Indian Ocean. A breathtaking fusion of white sandy beaches, crystal-clear turquoise waters, and the historic charm of Stone Town.',
  'June to October (Dry Season)',
  'Red Colobus Monkeys, Dolphins, Sea Turtles',
  '2,462 sq km',
  -6.1659,
  39.2026
)
ON CONFLICT (name) DO UPDATE SET 
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;
