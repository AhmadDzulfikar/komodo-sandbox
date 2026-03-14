-- CreateEnum
CREATE TYPE "BoatImageType" AS ENUM ('MAIN_DISPLAY', 'EXTERIOR', 'EXTERIOR_2', 'DINING_ROOM', 'DINING_ROOM_2', 'JACUZZI', 'ROOFTOP_DECK', 'SHARING_TOILET', 'RELAX_AREA', 'RELAX_AREA_2', 'RELAX_AREA_3', 'OTHER_1', 'OTHER_2', 'OTHER_3', 'OTHER_4');

-- CreateEnum
CREATE TYPE "CabinImageType" AS ENUM ('MAIN_DISPLAY', 'BEDROOM', 'BATHROOM', 'BALCONY', 'JACUZZI', 'BATHTUB', 'OTHER_1', 'OTHER_2', 'OTHER_3', 'OTHER_4');

-- CreateTable
CREATE TABLE "boats" (
    "boat_id" TEXT NOT NULL,
    "boat_name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "operator" TEXT,
    "operator_id" TEXT,
    "trip" TEXT,
    "destinations" TEXT,
    "type" TEXT,
    "base_capacity" INTEGER,
    "extra_pay_capacity" INTEGER,
    "total_capacity" INTEGER,
    "_base_booking_price" DECIMAL(12,2),
    "_additional_pax_price" DECIMAL(12,2),
    "base_booking_price" DECIMAL(12,2),
    "additional_pax_price" DECIMAL(12,2),
    "_margin" DECIMAL(10,4),
    "coefficient" DECIMAL(10,4),
    "boat_display_facilities" TEXT[],
    "unlimited_free_wifi" BOOLEAN NOT NULL DEFAULT false,
    "starlink_wifi" BOOLEAN NOT NULL DEFAULT false,
    "jacuzzi" BOOLEAN NOT NULL DEFAULT false,
    "paddle_board" BOOLEAN NOT NULL DEFAULT false,
    "canoe" BOOLEAN NOT NULL DEFAULT false,
    "kayak" BOOLEAN NOT NULL DEFAULT false,
    "fishing_gear" BOOLEAN NOT NULL DEFAULT false,
    "snorkeling_avail" BOOLEAN NOT NULL DEFAULT false,
    "diving_avail" BOOLEAN NOT NULL DEFAULT false,
    "phinisi" BOOLEAN NOT NULL DEFAULT false,
    "boat_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boats_pkey" PRIMARY KEY ("boat_id")
);

-- CreateTable
CREATE TABLE "cabins" (
    "cabin_id" TEXT NOT NULL,
    "cabin_name" TEXT NOT NULL,
    "cabin_name_api" TEXT,
    "description" TEXT,
    "cabin_type" TEXT,
    "operator" TEXT,
    "cabin_description" TEXT,
    "base_capacity" INTEGER,
    "extra_pay_capacity" INTEGER,
    "total_capacity" INTEGER,
    "base_booking_price" DECIMAL(12,2),
    "additional_pax_price" DECIMAL(12,2),
    "margin" DECIMAL(10,4),
    "coefficient" DECIMAL(10,4),
    "price" DECIMAL(12,2),
    "cabin_display_facilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "seaview" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "private_jacuzzi" BOOLEAN NOT NULL DEFAULT false,
    "bathtub" BOOLEAN NOT NULL DEFAULT false,
    "large_bed" BOOLEAN NOT NULL DEFAULT false,
    "boat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cabins_pkey" PRIMARY KEY ("cabin_id")
);

-- CreateTable
CREATE TABLE "boat_images" (
    "id" TEXT NOT NULL,
    "boat_id" TEXT NOT NULL,
    "type" "BoatImageType" NOT NULL,
    "drive_url" TEXT,
    "public_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boat_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabin_images" (
    "id" TEXT NOT NULL,
    "cabin_id" TEXT NOT NULL,
    "type" "CabinImageType" NOT NULL,
    "drive_url" TEXT,
    "public_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cabin_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cabins_boat_id_idx" ON "cabins"("boat_id");

-- CreateIndex
CREATE INDEX "boat_images_boat_id_idx" ON "boat_images"("boat_id");

-- CreateIndex
CREATE UNIQUE INDEX "boat_images_boat_id_type_key" ON "boat_images"("boat_id", "type");

-- CreateIndex
CREATE INDEX "cabin_images_cabin_id_idx" ON "cabin_images"("cabin_id");

-- CreateIndex
CREATE UNIQUE INDEX "cabin_images_cabin_id_type_key" ON "cabin_images"("cabin_id", "type");

-- AddForeignKey
ALTER TABLE "cabins" ADD CONSTRAINT "cabins_boat_id_fkey" FOREIGN KEY ("boat_id") REFERENCES "boats"("boat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boat_images" ADD CONSTRAINT "boat_images_boat_id_fkey" FOREIGN KEY ("boat_id") REFERENCES "boats"("boat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabin_images" ADD CONSTRAINT "cabin_images_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("cabin_id") ON DELETE CASCADE ON UPDATE CASCADE;
