-- AlterTable
ALTER TABLE "boats" ADD COLUMN     "source_hash" TEXT,
ADD COLUMN     "source_updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "cabins" ADD COLUMN     "source_hash" TEXT,
ADD COLUMN     "source_updated_at" TIMESTAMP(3);
