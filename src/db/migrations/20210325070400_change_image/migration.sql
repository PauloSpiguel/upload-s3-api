/*
  Warnings:

  - You are about to drop the column `fileName` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `images` table. All the data in the column will be lost.
  - Added the required column `name` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "fileName",
DROP COLUMN "originalName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL;
