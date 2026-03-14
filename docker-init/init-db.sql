-- Minimal bootstrap for local PostgreSQL containers.
-- The official postgres image already creates POSTGRES_USER and POSTGRES_DB
-- from the environment, so this script intentionally avoids creating roles
-- or granting elevated privileges.

SELECT current_database() AS database_name, current_user AS app_role;
