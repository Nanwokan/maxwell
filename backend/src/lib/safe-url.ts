const RELATIVE_LINK_PATTERN = /^(\/|\.\/|\.\.\/|#)/;
const HASH_LINK_PATTERN = /^#[-a-z0-9_]+$/i;
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function toUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function isSafeHttpUrl(value: string): boolean {
  const parsed = toUrl(value);
  return parsed !== null && (parsed.protocol === 'http:' || parsed.protocol === 'https:');
}

export function isSafeAbsoluteUrl(value: string): boolean {
  const parsed = toUrl(value);
  return parsed !== null && ALLOWED_PROTOCOLS.has(parsed.protocol);
}

export function isSafeRelativeUrl(value: string): boolean {
  return RELATIVE_LINK_PATTERN.test(value);
}

export function isSafeLink(value: string): boolean {
  return isSafeRelativeUrl(value) || isSafeAbsoluteUrl(value);
}

export function isSafeAnchorOrLink(value: string): boolean {
  return HASH_LINK_PATTERN.test(value) || isSafeLink(value);
}
