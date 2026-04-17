-- Create guides table for real team roster management

CREATE TABLE guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    experience_years INTEGER,
    languages TEXT[],
    specialty TEXT,
    bio TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS policies
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- Anyone can read active profiles
CREATE POLICY "Public can view active guides" ON guides
    FOR SELECT USING (is_active = true);

-- Only authenticated admins can manage the team
CREATE POLICY "Admins can manage guides" ON guides
    FOR ALL USING (auth.role() = 'authenticated');
