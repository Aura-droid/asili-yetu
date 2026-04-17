-- Create destinations table if not exists
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT UNIQUE NOT NULL,
  type TEXT,
  image_url TEXT,
  description TEXT,
  best_time TEXT,
  key_wildlife TEXT,
  size TEXT
);

-- Seed initial destinations
INSERT INTO destinations (name, type, image_url, description, best_time, key_wildlife, size)
VALUES 
  ('Serengeti National Park', 'Endless Plains', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80', 'The crown jewel of Tanzania. Home to the legendary Great Migration, where millions of wildebeest and zebra traverse the endless plains under the watchful eyes of Africa''s apex predators.', 'June to October (The Migration)', 'Lions, Leopards, Cheetahs, Wildebeest', '14,763 sq km'),
  ('Ngorongoro Crater', 'Volcanic Caldera', 'https://images.unsplash.com/photo-1542317148-8b4bdccaebfa?auto=format&fit=crop&q=80', 'A breathtaking natural amphitheater. This collapsed volcano acts as a natural enclosure for a staggering diversity of wildlife, offering the densest concentration of Big Five animals on Earth.', 'Year-Round', 'Black Rhino, Lions, Hippos, Flamingos', '260 sq km'),
  ('Tarangire National Park', 'Baobab Wilderness', 'https://images.unsplash.com/photo-1533413867623-a5ff50bde5b1?auto=format&fit=crop&q=80', 'The kingdom of elephants and ancient Baobab trees. Deep reddish earth and the winding Tarangire river create a spectacular dry-season sanctuary for massive herds.', 'July to November', 'Massive Elephant Herds, Leopards, Pythons', '2,850 sq km'),
  ('Mount Kilimanjaro', 'Alpine Summit', 'https://images.unsplash.com/photo-1520600863004-9721eb41b4e0?auto=format&fit=crop&q=80', 'The Roof of Africa. Rising utterly alone from the surrounding plains, this dormant volcano offers one of the most awe-inspiring trekking experiences in the world.', 'January to March / August to October', 'Colobus Monkeys, Alpine Ecology', '5,895 meters (Peak)')
ON CONFLICT (name) DO NOTHING;
