export type InquiryEntity = "boat" | "cabin" | "general";

type QueryParamValue = string | string[] | undefined;

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const DISALLOWED_DISPLAY_CHARS = /[<>{}`]/g;
const SAFE_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const WHATSAPP_PATTERN = /^\d{8,15}$/;

function getFirstValue(value: QueryParamValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function normalizeDisplayValue(value: QueryParamValue, maxLength: number) {
  const rawValue = getFirstValue(value);
  if (!rawValue) {
    return undefined;
  }

  const normalized = rawValue
    .normalize("NFKC")
    .replace(CONTROL_CHARS, " ")
    .replace(DISALLOWED_DISPLAY_CHARS, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, maxLength);
}

export function normalizeInquiryEntity(value: QueryParamValue): InquiryEntity {
  const normalized = normalizeDisplayValue(value, 16)?.toLowerCase();

  if (normalized === "cabin") {
    return "cabin";
  }

  if (normalized === "general") {
    return "general";
  }

  return "boat";
}

export function normalizeInquiryId(value: QueryParamValue) {
  const rawValue = getFirstValue(value);
  if (!rawValue) {
    return undefined;
  }

  const normalized = rawValue.normalize("NFKC").trim();
  if (!SAFE_ID_PATTERN.test(normalized)) {
    return undefined;
  }

  return normalized;
}

export function normalizeInquiryLabel(value: QueryParamValue, fallback: string) {
  return normalizeDisplayValue(value, 120) ?? fallback;
}

export function normalizeSalesEmail(value?: string | null) {
  const email = value?.trim();
  if (!email || !EMAIL_PATTERN.test(email)) {
    return undefined;
  }

  return email;
}

export function normalizeWhatsAppNumber(value?: string | null) {
  const digitsOnly = value?.replace(/\D/g, "");
  if (!digitsOnly || !WHATSAPP_PATTERN.test(digitsOnly)) {
    return undefined;
  }

  return digitsOnly;
}

export function getInquiryBackLink(entity: InquiryEntity, id?: string) {
  if (entity === "boat" && id) {
    return {
      href: `/boats/${id}`,
      label: "Go back to boat detail",
    };
  }

  if (entity === "cabin" && id) {
    return {
      href: `/cabins/${id}`,
      label: "Go back to cabin detail",
    };
  }

  return {
    href: "/",
    label: "Return to homepage",
  };
}
