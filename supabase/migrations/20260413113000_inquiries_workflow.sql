-- Create inquiries table to power the Quote & Concierge CRM

CREATE TYPE inquiry_status AS ENUM ('new', 'in_discussion', 'quote_sent', 'confirmed', 'cancelled');

CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    party_size INTEGER,
    travel_dates TEXT,
    budget_range TEXT,
    special_requests TEXT,
    status inquiry_status DEFAULT 'new',
    admin_notes TEXT,
    itinerary_details JSONB, -- Stores the generated package or custom notes they requested
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS policies
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view and edit inquiries
CREATE POLICY "Admins can manage inquiries" ON inquiries
    FOR ALL USING (auth.role() = 'authenticated');

-- Anyone can insert an inquiry
CREATE POLICY "Public can insert inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);
