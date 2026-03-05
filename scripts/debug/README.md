# Debug Scripts

This directory stores local troubleshooting scripts that are not used by the
runtime application.

- `debug-db.js`: direct PostgreSQL connectivity check
- `test-prisma-env.js`: Prisma + env loading diagnostics
- `debug-env.ps1`: PowerShell env diagnostics
- `fix-prisma.ps1`: legacy Prisma troubleshooting helper
- `check-img.ts`: quick image record probe for a specific boat
- `get-boats.ts`: quick boat list probe

Use only in local development and do not run these scripts in production.
