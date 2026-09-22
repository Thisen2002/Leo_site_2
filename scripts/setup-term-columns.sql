-- Add term column to projects
ALTER TABLE projects ADD COLUMN term TEXT DEFAULT '25/26';

-- Add term column to executive_board
ALTER TABLE executive_board ADD COLUMN term TEXT DEFAULT '25/26';

-- Add term column to avenue_directors
ALTER TABLE avenue_directors ADD COLUMN term TEXT DEFAULT '25/26';
