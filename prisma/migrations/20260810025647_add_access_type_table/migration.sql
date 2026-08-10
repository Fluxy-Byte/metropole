-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessTypeId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "AccessType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessType_name_key" ON "AccessType"("name");

-- CreateIndex
CREATE INDEX "AccessType_name_idx" ON "AccessType"("name");

-- CreateIndex
CREATE INDEX "User_accessTypeId_idx" ON "User"("accessTypeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accessTypeId_fkey" FOREIGN KEY ("accessTypeId") REFERENCES "AccessType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
