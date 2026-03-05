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

2. Prepare environment variables in `.env`:

```bash
DATABASE_URL=postgresql://dev:devpass@localhost:5433/komodo_dev?schema=public
```

3. Start PostgreSQL:

```bash
docker compose up -d db
```

4. Run app:

```bash
npm run dev
```

## Image URL Normalization

Legacy data from the n8n pipeline may store boat image URLs with `/boats/`, while
R2 objects are actually served from `/=boats/`.

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
- Docker compose uses password auth for PostgreSQL (no host `trust` auth).
- Next.js image `remotePatterns` are restricted to known hosts and paths.

## Debug Scripts

Troubleshooting scripts are kept in `scripts/debug` and are not part of runtime
code.
