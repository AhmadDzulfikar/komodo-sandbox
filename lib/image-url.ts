const CDN_PREFIX_NORMALIZATIONS = [
  {
    from: "12seasalliance.uk/boats/",
    to: "12seasalliance.uk/=boats/",
  },
  {
    from: "12seasalliance.uk/=cabins/",
    to: "12seasalliance.uk/cabins/",
  },
] as const;

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

  return CDN_PREFIX_NORMALIZATIONS.reduce((normalizedUrl, rule) => {
    return normalizedUrl.replace(rule.from, rule.to);
  }, trimmed);
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
