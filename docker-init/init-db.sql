-- Docker init script untuk PostgreSQL
-- File: docker-init/init-db.sql

-- Pastikan user dev ada dengan password yang benar
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dev') THEN
        CREATE USER dev WITH PASSWORD 'devpass' CREATEDB SUPERUSER;
        RAISE NOTICE 'User dev created successfully';
    ELSE
        ALTER USER dev WITH PASSWORD 'devpass';
        RAISE NOTICE 'User dev password updated';
    END IF;
END
$$;

-- Pastikan database komodo_dev ada
SELECT 'CREATE DATABASE komodo_dev OWNER dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'komodo_dev')\gexec

-- Grant semua privileges
GRANT ALL PRIVILEGES ON DATABASE komodo_dev TO dev;

-- Log untuk debugging
SELECT 'Database komodo_dev setup completed for user dev' AS status;