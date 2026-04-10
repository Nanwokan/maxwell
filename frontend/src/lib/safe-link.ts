const RELATIVE_LINK_PATTERN = /^(\/|\.\/|\.\.\/|#)/;
const HASH_LINK_PATTERN = /^#[-a-z0-9_]+$/i;
const ALLOWED_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function parseAbsoluteUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isAllowedExternalProtocol(protocol: string): boolean {
  return ALLOWED_EXTERNAL_PROTOCOLS.has(protocol);
}

export function sanitizeExternalUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = parseAbsoluteUrl(trimmed);
  if (!parsed || !isAllowedExternalProtocol(parsed.protocol)) {
    return null;
  }

  return trimmed;
}

export function sanitizeAnchorOrLink(value: string | null | undefined, fallback = '#'): string {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  if (HASH_LINK_PATTERN.test(trimmed) || RELATIVE_LINK_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const external = sanitizeExternalUrl(trimmed);
  return external ?? fallback;
}

export function sanitizeEmbedUrl(value: string | null | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const parsed = parseAbsoluteUrl(trimmed);
  if (!parsed || (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')) {
    return fallback;
  }

  return trimmed;
}

export function sanitizeWhatsAppPhone(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  return digits.startsWith('00') ? digits.slice(2) : digits;
}
