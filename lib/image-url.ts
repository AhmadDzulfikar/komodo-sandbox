const BOAT_PATH_WRONG = "12seasalliance.uk/boats/";
const BOAT_PATH_FIXED = "12seasalliance.uk/=boats/";

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
    return trimmed;
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
