/*
  Warnings:

  - You are about to drop the column `pathUrl` on the `images` table. All the data in the column will be lost.
  - Added the required column `originalName` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "pathUrl",
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "size" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "url" TEXT;
