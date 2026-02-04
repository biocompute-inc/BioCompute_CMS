-- Update existing jobs to have the type field set to 'full-time'
UPDATE "Job" SET type = 'full-time' WHERE type IS NULL;
