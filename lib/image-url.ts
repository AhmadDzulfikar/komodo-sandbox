/**
 * n8n historical mismatch:
 * - actual R2 public prefix: `https://12seasalliance.uk/=boats/...`
 * - some DB rows were written as `https://12seasalliance.uk/boats/...`
 *
 * We normalize only this known mismatch until all legacy rows are corrected
 * in the source data pipeline.
 */
const BOAT_PATH_WRONG = "12seasalliance.uk/boats/";
const BOAT_PATH_FIXED = "12seasalliance.uk/=boats/";

const DRIVE_FALLBACK_ENV = "ENABLE_DRIVE_IMAGE_FALLBACK";

function isDriveFallbackEnabled() {
  return process.env[DRIVE_FALLBACK_ENV] === "true";
}

function extractGoogleDriveFileId(url: string): string | null {
  const fromPath = url.match(/\/file\/d\/([^/]+)/);
  if (fromPath?.[1]) return fromPath[1];

  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("id");
  } catch {
    return null;
  }
}

export function normalizePublicImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  return trimmed.replace(BOAT_PATH_WRONG, BOAT_PATH_FIXED);
}

export function normalizeDriveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  if (!trimmed.includes("drive.google.com")) {
    return undefined;
  }

  // Drive thumbnails are unreliable for private files.
  // Keep this fallback opt-in for local debugging only.
  if (!isDriveFallbackEnabled()) {
    return undefined;
  }

  const fileId = extractGoogleDriveFileId(trimmed);
  if (!fileId) return undefined;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
}

export function toRenderableImageUrl(
  publicUrl?: string | null,
  driveUrl?: string | null
): string | undefined {
  return normalizePublicImageUrl(publicUrl) ?? normalizeDriveImageUrl(driveUrl);
}
