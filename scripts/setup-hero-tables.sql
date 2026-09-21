-- Drop table if it exists to start fresh
DROP TABLE IF EXISTS hero_images;

-- Create Hero Images table
CREATE TABLE hero_images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Access for hero_images" ON hero_images FOR SELECT USING (true);

-- Allow authenticated users (Admin) to insert/update/delete
CREATE POLICY "Admin Insert for hero_images" ON hero_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Update for hero_images" ON hero_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete for hero_images" ON hero_images FOR DELETE USING (auth.role() = 'authenticated');
