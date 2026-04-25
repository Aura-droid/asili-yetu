-- Migration: Bulk Content Upload
-- Purpose: Insert records for Culture, Gallery, and Fleet using local static paths.

-- 1. Insert Culture Stories
INSERT INTO public.culture_stories (title, description, image_url, category, is_active, is_featured)
VALUES 
('Hadzabe Life', 'Deep in the Rift Valley, the Hadzabe people continue their ancient hunter-gatherer lifestyle, a living link to our ancestors.', '/images/Culture/Hadzabe.jpg', 'Traditions', true, true),
('Hadzabe Traditions', 'Learning the art of survival and tracking with the Hadzabe tribe.', '/images/Culture/Hadzabe-2.jpeg', 'Traditions', true, false),
('Maasai Ceremonial Dance', 'The iconic jumping dance of the Maasai warriors, a powerful display of strength and community.', '/images/Culture/Maasai Dance.jpeg', 'Traditions', true, true),
('Maasai Shanga Artistry', 'Intricate beadwork that tells stories of identity, status, and heritage.', '/images/Culture/Maasai Shanga.jpeg', 'Art', true, true),
('Makonde Carvings', 'Masterpieces of ebony wood that bridge the gap between spirits and the physical world.', '/images/Culture/Makonde Carvings.jpeg', 'Art', true, false),
('Our Canvas Art', 'Contemporary expressions of Tanzanian life and landscapes.', '/images/Culture/Our canvas art.jpeg', 'Art', true, false),
('Tanzanian Rhythms', 'The heartbeat of our nation, expressed through traditional instruments and song.', '/images/Culture/Our music.jpeg', 'Traditions', true, false),
('Shanga Souvenirs', 'Handcrafted treasures made with passion and precision.', '/images/Culture/Shanga souvenirs.jpeg', 'Art', true, false),
('Cultural Keepsakes', 'Mementos that carry the spirit of Tanzania back home with you.', '/images/Culture/Souvenirs.jpeg', 'Art', true, false)
ON CONFLICT DO NOTHING;

-- 2. Insert Gallery Items
INSERT INTO public.gallery_items (url, caption, type, source, is_active, is_featured)
VALUES 
('/images/Gallery/Buffalos.jpeg', 'The Mighty Cape Buffalo', 'image', 'manual', true, true),
('/images/Gallery/Cheetah kid.jpeg', 'Cheetah Cub in the Serengeti', 'image', 'manual', true, true),
('/images/Gallery/Cheetah.jpeg', 'The World''s Fastest Land Animal', 'image', 'manual', true, true),
('/images/Gallery/Flamingos.jpeg', 'Pink Horizon at Lake Manyara', 'image', 'manual', true, true),
('/images/Gallery/Hippos.jpeg', 'Hippo Pool Social Club', 'image', 'manual', true, false),
('/images/Gallery/Hyena.jpeg', 'The Misunderstood Predator', 'image', 'manual', true, false),
('/images/Gallery/Impala.jpeg', 'Grace in Motion', 'image', 'manual', true, false),
('/images/Gallery/Kilimanjaro View.jpeg', 'The Roof of Africa', 'image', 'manual', true, false),
('/images/Gallery/Lion.jpeg', 'The King of the Savannah', 'image', 'manual', true, false),
('/images/Gallery/Lioness.jpeg', 'The True Hunter of the Pride', 'image', 'manual', true, false),
('/images/Gallery/Nguchiro.jpeg', 'The Curious Mongoose', 'image', 'manual', true, false),
('/images/Gallery/Turtles.jpeg', 'Ancient Travelers of Zanzibar', 'image', 'manual', true, false),
('/images/Gallery/Twiga.jpeg', 'Tanzania''s National Symbol', 'image', 'manual', true, false),
('/images/Gallery/Warthog.jpeg', 'Pumbaa in the Wild', 'image', 'manual', true, false),
('/images/Gallery/Zebra.jpeg', 'Nature''s Striking Patterns', 'image', 'manual', true, false),
('/images/Gallery/Zanzibar.jpeg', 'The Spice Island Paradise', 'image', 'manual', true, false)
ON CONFLICT DO NOTHING;

-- 3. Insert Fleet Vehicles
INSERT INTO public.vehicles (model_name, plate_number, capacity, features, image_url, is_available)
VALUES 
('Serengeti Explorer', 'T 101 ASY', 7, ARRAY['Pop-up Roof', 'WiFi', 'Fridge', 'Charging Ports'], '/images/Fleet/Fleet exterior.jpeg', true),
('Savannah Cruiser', 'T 202 ASY', 7, ARRAY['Pop-up Roof', 'Inverter', 'Fridge'], '/images/Fleet/Fleet exterior-2.jpeg', true),
('Kilimanjaro Shuttle', 'T 303 ASY', 7, ARRAY['Pop-up Roof', 'Extra Storage'], '/images/Fleet/Fleet exterior-3.jpeg', true),
('Elite Interior Alpha', 'T 404 ASY', 7, ARRAY['Premium Leather', 'Fridge', 'Dual AC'], '/images/Fleet/Fleet interior-1.jpg', true),
('Elite Interior Beta', 'T 505 ASY', 7, ARRAY['Premium Leather', 'Inverter', 'WiFi'], '/images/Fleet/Fleet Interior-2.jpeg', true)
ON CONFLICT DO NOTHING;
