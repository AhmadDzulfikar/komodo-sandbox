# =================================================================
# PANDUAN LENGKAP PERBAIKAN PRISMA V7 + POSTGRESQL AUTHENTICATION
# =================================================================

# MASALAH YANG TERIDENTIFIKASI:
# 1. pg_hba.conf menggunakan scram-sha-256 untuk koneksi external
# 2. Koneksi dari host ke Docker container memerlukan SCRAM-SHA-256 auth
# 3. User 'dev' sudah ada password hash yang benar, tapi koneksi gagal

# =================================================================
# SOLUSI 1: FIX PG_HBA.CONF (RECOMMENDED FOR DEVELOPMENT)
# =================================================================

Write-Host "=== SOLUSI 1: UPDATE PG_HBA.CONF ===" -ForegroundColor Green

# Step 1: Backup current pg_hba.conf
Write-Host "1. Backup pg_hba.conf..." -ForegroundColor Yellow
docker exec komodo-sandbox-web-db-1 cp /var/lib/postgresql/data/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf.backup

# Step 2: Update pg_hba.conf untuk enforce SCRAM authentication
Write-Host "2. Update pg_hba.conf untuk development..." -ForegroundColor Yellow
docker exec komodo-sandbox-web-db-1 bash -c "echo '# Development: enforce SCRAM for docker networks
host    all             all             172.17.0.0/16           scram-sha-256
host    all             all             10.0.0.0/8              scram-sha-256
host    all             all             192.168.0.0/16          scram-sha-256' >> /var/lib/postgresql/data/pg_hba.conf"

# Step 3: Reload PostgreSQL configuration
Write-Host "3. Reload PostgreSQL configuration..." -ForegroundColor Yellow
docker exec komodo-sandbox-web-db-1 psql -U dev -d komodo_dev -c "SELECT pg_reload_conf();"

# =================================================================
# SOLUSI 2: RECREATE USER DENGAN PASSWORD BARU (ALTERNATIVE)
# =================================================================

Write-Host "`n=== SOLUSI 2: RECREATE USER (ALTERNATIVE) ===" -ForegroundColor Green

# Step 1: Recreate user dengan password yang fresh
Write-Host "1. Recreate user dev dengan password baru..." -ForegroundColor Yellow
docker exec komodo-sandbox-web-db-1 psql -U postgres -c "DROP USER IF EXISTS dev;"
docker exec komodo-sandbox-web-db-1 psql -U postgres -c "CREATE USER dev WITH PASSWORD 'devpass' CREATEDB SUPERUSER;"

# =================================================================
# SOLUSI 3: DOCKER-COMPOSE DENGAN INIT SCRIPT (RECOMMENDED)
# =================================================================

Write-Host "`n=== SOLUSI 3: DOCKER-COMPOSE DENGAN INIT SCRIPT ===" -ForegroundColor Green
Write-Host "Buat file init-db.sql di folder docker-init/..." -ForegroundColor Yellow

# Create init script directory
if (!(Test-Path "docker-init")) {
    New-Item -ItemType Directory -Name "docker-init"
}

# Create init script
@"
-- Docker init script untuk PostgreSQL
-- File: docker-init/init-db.sql

-- Pastikan user dev ada dengan password yang benar
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dev') THEN
        CREATE USER dev WITH PASSWORD 'devpass' CREATEDB SUPERUSER;
    ELSE
        ALTER USER dev WITH PASSWORD 'devpass';
    END IF;
END
`$`$;

-- Pastikan database komodo_dev ada
SELECT 'CREATE DATABASE komodo_dev OWNER dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'komodo_dev')\gexec

-- Grant semua privileges
GRANT ALL PRIVILEGES ON DATABASE komodo_dev TO dev;
"@ | Out-File -FilePath "docker-init/init-db.sql" -Encoding UTF8

Write-Host "Init script dibuat di docker-init/init-db.sql" -ForegroundColor Green

# =================================================================
# TEST COMMANDS
# =================================================================

Write-Host "`n=== COMMANDS UNTUK TEST ===" -ForegroundColor Cyan

Write-Host "1. Test koneksi Node.js:" -ForegroundColor Yellow
Write-Host "   node scripts/debug/debug-db.js" -ForegroundColor White

Write-Host "`n2. Test Prisma generate:" -ForegroundColor Yellow  
Write-Host "   npx prisma generate" -ForegroundColor White

Write-Host "`n3. Test Prisma migrate:" -ForegroundColor Yellow
Write-Host "   npx prisma migrate dev --name init" -ForegroundColor White

Write-Host "`n4. Cek PostgreSQL logs:" -ForegroundColor Yellow
Write-Host "   docker logs komodo-sandbox-web-db-1 --tail=20" -ForegroundColor White

Write-Host "`n5. Reset PostgreSQL jika diperlukan:" -ForegroundColor Yellow
Write-Host "   docker-compose down -v" -ForegroundColor White
Write-Host "   docker-compose up -d" -ForegroundColor White

# =================================================================
# JALANKAN SOLUSI
# =================================================================

Write-Host "`n=== JALANKAN PERBAIKAN ===" -ForegroundColor Green
$choice = Read-Host "Pilih solusi (1=Fix pg_hba, 2=Recreate user, 3=Show docker-compose fix, ENTER=Skip)"

switch ($choice) {
    "1" {
        Write-Host "Menjalankan Solusi 1..." -ForegroundColor Green
        # Jalankan commands solusi 1 di atas
        docker exec komodo-sandbox-web-db-1 cp /var/lib/postgresql/data/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf.backup
        docker exec komodo-sandbox-web-db-1 bash -c "echo 'host all all 172.17.0.0/16 scram-sha-256' >> /var/lib/postgresql/data/pg_hba.conf"
        docker exec komodo-sandbox-web-db-1 psql -U dev -d komodo_dev -c "SELECT pg_reload_conf();"
        Write-Host "✅ pg_hba.conf updated. Test dengan: node scripts/debug/debug-db.js" -ForegroundColor Green
    }
    "2" {  
        Write-Host "Menjalankan Solusi 2..." -ForegroundColor Green
        docker exec komodo-sandbox-web-db-1 psql -U postgres -c "ALTER USER dev WITH PASSWORD 'devpass';"
        Write-Host "✅ User password updated. Test dengan: node scripts/debug/debug-db.js" -ForegroundColor Green
    }
    "3" {
        Write-Host "Lihat docker-compose.yml yang sudah diupdate untuk solusi lengkap." -ForegroundColor Green
    }
    default {
        Write-Host "Tidak ada yang dijalankan. Pilih solusi manual di atas." -ForegroundColor Yellow
    }
}
