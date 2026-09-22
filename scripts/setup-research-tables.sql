-- Drop table if it exists to start fresh
DROP TABLE IF EXISTS research_papers;

-- Create Research Papers table
CREATE TABLE research_papers (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Access for research_papers" ON research_papers FOR SELECT USING (true);

-- Allow authenticated users (Admin) to insert/update/delete
CREATE POLICY "Admin Insert for research_papers" ON research_papers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Update for research_papers" ON research_papers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete for research_papers" ON research_papers FOR DELETE USING (auth.role() = 'authenticated');
