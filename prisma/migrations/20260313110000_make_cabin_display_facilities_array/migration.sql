-- Legacy installations stored cabin_display_facilities as BOOLEAN.
-- Because that flag does not preserve facility names, we replace it with an
-- empty TEXT[] so fresh data ingests can populate real labels.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'cabins'
      AND column_name = 'cabin_display_facilities'
      AND udt_name = 'bool'
  ) THEN
    ALTER TABLE "cabins" DROP COLUMN "cabin_display_facilities";
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'cabins'
      AND column_name = 'cabin_display_facilities'
      AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE "cabins"
      ADD COLUMN "cabin_display_facilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;

UPDATE "cabins"
SET "cabin_display_facilities" = ARRAY[]::TEXT[]
WHERE "cabin_display_facilities" IS NULL;
