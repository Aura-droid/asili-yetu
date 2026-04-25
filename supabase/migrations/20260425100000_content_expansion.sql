-- Migration: Content Expansion and Localization
-- Purpose: Add provided content to database and ensure tables exist for reviews and site content.

-- 1. Create Reviews table if not exists
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1b. Ensure user_name exists if table was already there
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'local';

-- 2. Create Site Content table if not exists
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Seed Reviews (Testimonials)
INSERT INTO public.reviews (client_name, comment, rating, is_approved, user_name)
VALUES 
('Anna L.', 'I didn’t expect to feel so connected. It wasn’t just a safari—it felt like I was actually part of Tanzania for a while.', 5, true, 'Anna L., USA'),
('David M.', 'Our guide made everything so easy and natural. We saw wildlife up close, but also learned how everything is connected in nature and culture.', 5, true, 'David M., United Kingdom'),
('Sarah K.', 'I still talk about this trip all the time. Everything was smooth, but what stood out most was how genuine everyone was.', 5, true, 'Sarah K., Germany'),
('Michael R.', 'The visit to the Maasai village felt very respectful. It didn’t feel staged—it felt like real life shared with us in a kind way.', 5, true, 'Michael R., Canada'),
('Aisha M.', 'I felt safe the entire time. The team was always checking in and making sure we enjoyed every moment of the journey.', 5, true, 'Aisha M., United Arab Emirates'),
('Luca B.', 'Tanzania was already on my bucket list, but this experience made me fall in love with it. It felt real, not commercial.', 5, true, 'Luca B., Italy'),
('Emma J.', 'Kilimanjaro was tough, but the guides supported us step by step. I couldn’t have done it without them.', 5, true, 'Emma J., Australia'),
('James T.', 'What I liked most was how natural everything felt. No fake show—just nature, people, and honest moments.', 5, true, 'James T., South Africa'),
('Sophie N.', 'We arrived as travelers, but left feeling like we had new friends in Tanzania.', 5, true, 'Sophie N., France'),
('Daniel K.', 'It felt like being welcomed into someone’s home country with open arms.', 5, true, 'Daniel K., Kenya')
ON CONFLICT DO NOTHING;

-- 4. Upsert Site Content for Pages
-- ABOUT PAGE CONTENT
INSERT INTO public.site_content (key, data)
VALUES ('about_page', '{
    "en": {
        "who_we_are": "Asili Yetu Tours and Safari is a locally owned, ethically driven, and professionally managed travel company based in Arusha, Tanzania, with a representative office in Köln, Germany.",
        "origin": "We were born from a deep love for Tanzania and a desire to change how the world experiences Africa. Our vision was simple but powerful: travel should not only show places, it should reveal meaning.",
        "name_meaning": "The name “Asili Yetu” means Our Roots in Swahili. It represents identity, belonging, and origin. It reminds us that tourism must never disconnect people from the land, but instead reconnect them to it.",
        "specialization": "We specialize in safaris, cultural immersion, mountain trekking, coastal experiences, and tailor-made journeys that reflect the real Tanzania.",
        "storytellers": "But beyond services, we are storytellers, educators, and cultural ambassadors.",
        "responsibility": "We believe travel is a responsibility, not just a service. Every guest we host becomes part of our extended family and part of Tanzania’s living narrative.",
        "ceo_message": [
            "I was born and raised in Tanzania. This land shaped everything about me. I grew up hearing stories from elders, walking in nature, and living close to communities that depend on the land.",
            "I started Asili Yetu because I felt something was missing in tourism. Many visitors saw the animals, but they didn''t really connect with the people, the culture, and the real life of this country.",
            "Today, we have grown, but nothing inside us has changed. We are still rooted in the same values and the same love for our land. When you travel with Asili Yetu, you are experiencing Tanzania in a real, honest, and meaningful way."
        ]
    }
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- WHY TRAVEL WITH US
INSERT INTO public.site_content (key, data)
VALUES ('why_us', '{
    "en": {
        "title": "Why Travel With Us",
        "intro": "Choosing Asili Yetu Tours and Safari means choosing depth, responsibility, and authenticity.",
        "sections": [
            {
                "title": "QUALITY AND SAFETY",
                "points": ["Licensed professional guides", "Regular vehicle inspections", "Emergency preparedness systems", "24/7 support services"]
            },
            {
                "title": "RESPONSIBLE TOURISM",
                "points": ["Wildlife conservation", "Environmental protection", "Ethical tourism practices"]
            },
            {
                "title": "COMMUNITY IMPACT",
                "points": ["Local employment", "Fair partnerships", "Cultural respect"]
            },
            {
                "title": "AUTHENTIC EXPERIENCES",
                "content": "We avoid artificial tourism setups. What you experience is real Tanzania."
            },
            {
                "title": "PROFESSIONAL SERVICE",
                "content": "We combine African warmth with international service standards."
            }
        ]
    }
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- RESPONSIBLE TOURISM
INSERT INTO public.site_content (key, data)
VALUES ('responsible_tourism', '{
    "en": {
        "title": "Responsible Tourism",
        "intro": "We believe tourism must protect the future it benefits from today.",
        "commitments": [
            "Environmental protection practices",
            "Sustainable waste management",
            "Support for local economies",
            "Wildlife conservation partnerships",
            "Ethical cultural interactions"
        ],
        "success_metric": "We measure success not only in visitors, but in impact."
    }
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now();
