-- CreateTable
CREATE TABLE "ArchivedObituary" (
    "id" TEXT NOT NULL,
    "archiveKey" TEXT NOT NULL,
    "deceasedName" TEXT NOT NULL,
    "deathDateISO" TEXT NOT NULL,
    "deathDateAr" TEXT NOT NULL,
    "driveFileId" TEXT NOT NULL,
    "driveViewUrl" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "exportKind" TEXT NOT NULL,
    "exportCount" INTEGER NOT NULL DEFAULT 1,
    "ipHash" TEXT,
    "country" TEXT,
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArchivedObituary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArchivedObituary_archiveKey_key" ON "ArchivedObituary"("archiveKey");

-- CreateIndex
CREATE INDEX "ArchivedObituary_createdAt_idx" ON "ArchivedObituary"("createdAt");

-- CreateIndex
CREATE INDEX "ArchivedObituary_deathDateISO_idx" ON "ArchivedObituary"("deathDateISO");
