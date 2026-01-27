# Script PowerShell untuk debug Prisma environment variables
Write-Host "=== ENVIRONMENT VARIABLES DEBUG ===" -ForegroundColor Green

# Cek semua environment variables yang mengandung DATABASE
Write-Host "`n1. Environment variables dengan 'DATABASE':" -ForegroundColor Yellow
Get-ChildItem Env: | Where-Object Name -Like "*DATABASE*" | Format-Table Name, Value

# Cek NODE_ENV
Write-Host "`n2. NODE_ENV:" -ForegroundColor Yellow
Write-Host "NODE_ENV = $env:NODE_ENV"

# Cek current directory
Write-Host "`n3. Current Directory:" -ForegroundColor Yellow
Write-Host "PWD = $PWD"

# Test dotenv loading dengan Node.js
Write-Host "`n4. Test dotenv loading:" -ForegroundColor Yellow
node -e "import('dotenv/config').then(() => console.log('DATABASE_URL from dotenv:', process.env.DATABASE_URL))"

# Cek apakah ada .env files lain
Write-Host "`n5. Semua .env files di directory:" -ForegroundColor Yellow
Get-ChildItem -Path . -Name ".env*" -Force

Write-Host "`n=== DOCKER CONTAINER STATUS ===" -ForegroundColor Green
docker ps --filter "name=db"

Write-Host "`n=== TEST CONNECTION DENGAN NODE.JS ===" -ForegroundColor Green
node debug-db.js