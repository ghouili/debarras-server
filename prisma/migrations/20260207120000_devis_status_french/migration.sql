-- Rename devis status enum values to French equivalents.
ALTER TYPE "DevisStatus" RENAME VALUE 'new' TO 'nouveau';
ALTER TYPE "DevisStatus" RENAME VALUE 'quoted' TO 'traite';
ALTER TYPE "DevisStatus" RENAME VALUE 'won' TO 'gagne';
ALTER TYPE "DevisStatus" RENAME VALUE 'lost' TO 'perdu';

ALTER TABLE "Devis" ALTER COLUMN "status" SET DEFAULT 'nouveau';
