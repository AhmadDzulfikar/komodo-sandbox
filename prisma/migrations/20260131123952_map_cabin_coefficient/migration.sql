/*
  Warnings:

  - You are about to drop the column `coefficient` on the `cabins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cabins" DROP COLUMN "coefficient",
ADD COLUMN     "coeficient" DECIMAL(10,4);
