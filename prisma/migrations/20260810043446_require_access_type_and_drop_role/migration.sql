-- AlterTable: make accessTypeId required now that backfill is complete
ALTER TABLE "User" ALTER COLUMN "accessTypeId" SET NOT NULL;

-- Replace the SET NULL FK with RESTRICT: a User must always have a valid AccessType
ALTER TABLE "User" DROP CONSTRAINT "User_accessTypeId_fkey";
ALTER TABLE "User" ADD CONSTRAINT "User_accessTypeId_fkey" FOREIGN KEY ("accessTypeId") REFERENCES "AccessType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop the old fixed role enum, now fully replaced by AccessType
ALTER TABLE "User" DROP COLUMN "role";
DROP TYPE "Role";
