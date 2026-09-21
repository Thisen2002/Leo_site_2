-- Fix legacy project statuses
UPDATE projects 
SET status = 'Ongoing' 
WHERE status = '26/27 Term';
