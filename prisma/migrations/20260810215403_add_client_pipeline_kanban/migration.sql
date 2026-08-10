-- CreateEnum
CREATE TYPE "PipelineStage" AS ENUM ('START', 'IN_PROGRESS', 'NEGOTIATION', 'DONE');

-- CreateEnum
CREATE TYPE "ClientOutcome" AS ENUM ('SOLD', 'LOST');

-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'PIPELINE_UPDATE';

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "outcome" "ClientOutcome",
ADD COLUMN     "pipelineStage" "PipelineStage" NOT NULL DEFAULT 'START';

-- CreateIndex
CREATE INDEX "Client_pipelineStage_idx" ON "Client"("pipelineStage");
