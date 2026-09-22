-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS executive_board;
DROP TABLE IF EXISTS avenue_directors;

-- Create Executive Board table
CREATE TABLE executive_board (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    email TEXT,
    linkedin TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Avenue Directors table
CREATE TABLE avenue_directors (
    id SERIAL PRIMARY KEY,
    avenue TEXT NOT NULL,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    email TEXT,
    linkedin TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE executive_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE avenue_directors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Access for executive_board" ON executive_board FOR SELECT USING (true);
CREATE POLICY "Public Read Access for avenue_directors" ON avenue_directors FOR SELECT USING (true);

-- Allow authenticated users (Admin) to insert/update/delete
CREATE POLICY "Admin Insert for executive_board" ON executive_board FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Update for executive_board" ON executive_board FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete for executive_board" ON executive_board FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Insert for avenue_directors" ON avenue_directors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Update for avenue_directors" ON avenue_directors FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete for avenue_directors" ON avenue_directors FOR DELETE USING (auth.role() = 'authenticated');
