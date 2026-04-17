-- The 'Asili Cultural Archive' Infrastructure
CREATE TABLE IF NOT EXISTS culture_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'Traditions',
  accent_color TEXT DEFAULT '#a3cc4c',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  translations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for high-fidelity security
ALTER TABLE culture_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to culture stories"
  ON culture_stories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow admin full access to culture stories"
  ON culture_stories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
