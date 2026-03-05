DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'boats'
      AND column_name = 'coeficient'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'boats'
      AND column_name = 'coefficient'
  ) THEN
    ALTER TABLE "boats" RENAME COLUMN "coeficient" TO "coefficient";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'cabins'
      AND column_name = 'coeficient'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'cabins'
      AND column_name = 'coefficient'
  ) THEN
    ALTER TABLE "cabins" RENAME COLUMN "coeficient" TO "coefficient";
  END IF;
END $$;
