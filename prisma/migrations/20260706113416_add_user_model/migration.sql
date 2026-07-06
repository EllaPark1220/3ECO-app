-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LEARNER', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MediaPreference" AS ENUM ('VIDEO', 'TEXT', 'MIXED');

-- CreateEnum
CREATE TYPE "FontSize" AS ENUM ('XS', 'S', 'L', 'XL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" VARCHAR(40) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'LEARNER',
    "accessibilityMode" BOOLEAN NOT NULL DEFAULT false,
    "mediaPreference" "MediaPreference" NOT NULL DEFAULT 'MIXED',
    "fontSize" "FontSize" NOT NULL DEFAULT 'S',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
