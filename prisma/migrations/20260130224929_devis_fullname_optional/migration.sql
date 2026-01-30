/*
  Warnings:

  - You are about to drop the column `firstName` on the `Devis` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Devis` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Devis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "consent" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Devis" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "fullName" TEXT NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL,
ALTER COLUMN "timing" DROP NOT NULL,
ALTER COLUMN "localType" DROP NOT NULL,
ALTER COLUMN "floor" DROP NOT NULL,
ALTER COLUMN "elevator" DROP NOT NULL,
ALTER COLUMN "consent" SET DEFAULT true;
