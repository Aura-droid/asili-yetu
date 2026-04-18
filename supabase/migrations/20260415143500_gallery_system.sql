-- Create the gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  type TEXT DEFAULT 'image', -- image or video
  source TEXT DEFAULT 'manual', -- manual or instagram
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public viewing
DROP POLICY IF EXISTS "Public items are viewable by everyone" ON gallery_items;
CREATE POLICY "Public items are viewable by everyone" ON gallery_items
  FOR SELECT USING (is_active = true);

-- Create policy for admin full access
DROP POLICY IF EXISTS "Admins have full access" ON gallery_items;
CREATE POLICY "Admins have full access" ON gallery_items
  FOR ALL USING (auth.role() = 'authenticated');
