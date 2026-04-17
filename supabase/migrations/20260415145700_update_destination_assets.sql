-- Migration: Connect High-Fidelity Destination Assets
-- Updates existing destinations to use local optimized assets 
-- and adds Zanzibar to the expedition list.

UPDATE destinations 
SET image_url = '/destinations/ngorongoro-1.jpg' 
WHERE name = 'Ngorongoro Crater';

UPDATE destinations 
SET image_url = '/destinations/tarangire-1.jpg' 
WHERE name = 'Tarangire National Park';

UPDATE destinations 
SET image_url = '/destinations/kilimanjaro-1.jpg' 
WHERE name = 'Mount Kilimanjaro';

-- Add Zanzibar Archipelago
INSERT INTO destinations (name, type, image_url, description, best_time, key_wildlife, size)
VALUES (
  'Zanzibar Archipelago', 
  'Tropical Paradise', 
  '/destinations/zanzibar-1.jpg', 
  'The Spice Islands. A mesmerizing blend of white sand beaches, turquoise waters, and ancient Stone Town history. The perfect sanctuary for post-safari relaxation.', 
  'June to October', 
  'Red Colobus Monkeys, Sea Turtles, Dolphins', 
  '2,462 sq km'
)
ON CONFLICT (name) DO UPDATE 
SET image_url = EXCLUDED.image_url, 
    type = EXCLUDED.type, 
    description = EXCLUDED.description;
