-- CreateTable
CREATE TABLE "ObituaryStat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,
    "country" TEXT,
    "region" TEXT,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "ObituaryStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ObituaryStat_createdAt_idx" ON "ObituaryStat"("createdAt");

-- CreateIndex
CREATE INDEX "ObituaryStat_templateId_idx" ON "ObituaryStat"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");
