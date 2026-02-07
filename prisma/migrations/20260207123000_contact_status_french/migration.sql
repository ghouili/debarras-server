-- Rename contact status enum values to French equivalents.
ALTER TYPE "ContactStatus" RENAME VALUE 'new' TO 'nouveau';
ALTER TYPE "ContactStatus" RENAME VALUE 'in_progress' TO 'en_cours';
ALTER TYPE "ContactStatus" RENAME VALUE 'closed' TO 'fermee';

ALTER TABLE "Contact" ALTER COLUMN "status" SET DEFAULT 'nouveau';
