/*
  Warnings:

  - You are about to drop the column `extra_pay_capacity` on the `boats` table. All the data in the column will be lost.
  - You are about to drop the column `extra_pay_capacity` on the `cabins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boats" RENAME COLUMN "extra_pay_capacity" TO "extra_pax_capacity";

-- AlterTable
ALTER TABLE "cabins" RENAME COLUMN "extra_pay_capacity" TO "extra_pax_capacity";
