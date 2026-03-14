# Komodo Sandbox Web

Luxury multi-boat and multi-cabin booking web app built with Next.js App Router,
PostgreSQL, Prisma, and Cloudflare R2 image delivery.

## Stack

- Next.js 16 (`app/` router, Turbopack)
- React 19
- Prisma 7 + PostgreSQL
- Tailwind CSS 4
- Cloudflare R2 public image URLs

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Prepare environment variables in `.env` using `.env.example` as the template:

```bash
DATABASE_URL=postgresql://app_user:replace-with-strong-password@localhost:5433/komodo_dev?schema=public
SALES_EMAIL=reservations@example.com
SALES_WHATSAPP_NUMBER=6281234567890
POSTGRES_USER=app_user
POSTGRES_PASSWORD=replace-with-strong-password
POSTGRES_DB=komodo_dev
POSTGRES_PORT=5433
```

3. Start PostgreSQL:

```bash
docker compose up -d db
```

Optional debug mode with verbose PostgreSQL logs:

```bash
docker compose -f docker-compose.yml -f docker-compose.debug.yml up -d db
```

4. Run app:

```bash
npm run dev
```

## Image URL Normalization

Legacy data from the n8n pipeline may store boat image URLs with `/boats/`, while
R2 objects are actually served from `/=boats/`. Cabin image URLs can also arrive
with the inverse mismatch (`/=cabins/` instead of `/cabins/`).

The app normalizes this mismatch in `lib/image-url.ts` to keep old rows renderable.

Long-term fix: correct URLs in source data and remove runtime normalization.

## Google Drive Fallback Policy

Google Drive thumbnail fallback is disabled by default because private Drive files
often fail in production.

Enable only for local debugging by setting:

```bash
ENABLE_DRIVE_IMAGE_FALLBACK=true
```

## Security Notes

- `DATABASE_URL` is required at startup (`lib/prisma.ts`).
- Inquiry search params are normalized before rendering or generating contact links.
- Sales contact channels are configured via `SALES_EMAIL` and `SALES_WHATSAPP_NUMBER`.
- Docker compose requires PostgreSQL credentials from environment variables instead of hardcoded defaults.
- The Docker init script no longer creates superuser roles.
- Next.js image `remotePatterns` are restricted to known hosts and paths.

## Dependency Notes

- `package.json` uses scoped `overrides` only for Prisma internals and the ESLint cache chain.
- This keeps the audit fix targeted instead of globally pinning packages the app does not import directly.

## Debug Scripts

Troubleshooting scripts are kept in `scripts/debug` and are not part of runtime
code.
