import type { CookieOptions, Request } from 'express';

import { env } from '../config/env';
import { ADMIN_TOKEN_TTL_SECONDS } from './auth-token';

export const ADMIN_AUTH_COOKIE_NAME = 'maxwell_admin_token';

function parseCookieHeader(cookieHeader: string): Record<string, string> {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((cookies, entry) => {
      const separatorIndex = entry.indexOf('=');
      if (separatorIndex <= 0) {
        return cookies;
      }

      const rawKey = entry.slice(0, separatorIndex).trim();
      const rawValue = entry.slice(separatorIndex + 1).trim();
      if (!rawKey) {
        return cookies;
      }

      try {
        cookies[rawKey] = decodeURIComponent(rawValue);
      } catch {
        cookies[rawKey] = rawValue;
      }
      return cookies;
    }, {});
}

export function getAdminAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/api/admin',
    maxAge: ADMIN_TOKEN_TTL_SECONDS * 1000,
  };
}

export function getAdminAuthCookieClearOptions(): CookieOptions {
  const clearOptions = { ...getAdminAuthCookieOptions() };
  delete clearOptions.maxAge;
  return clearOptions;
}

export function extractAdminToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    return token.length > 0 ? token : null;
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = parseCookieHeader(cookieHeader);
  const cookieToken = cookies[ADMIN_AUTH_COOKIE_NAME];
  return cookieToken && cookieToken.length > 0 ? cookieToken : null;
}
