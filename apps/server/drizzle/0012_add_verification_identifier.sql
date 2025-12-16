-- Add identifier column to verification table
ALTER TABLE "verification" ADD COLUMN "identifier" text NOT NULL DEFAULT '';

-- Create index on identifier
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");

-- Remove default value after adding column
ALTER TABLE "verification" ALTER COLUMN "identifier" DROP DEFAULT;
