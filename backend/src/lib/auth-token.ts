import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../config/env';

export type AdminRole = 'super_admin' | 'admin' | 'editor';
export const ADMIN_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export type AdminTokenPayload = JwtPayload & {
  sub: string;
  email: string;
  role: AdminRole;
};

export function signAdminToken(payload: {
  id: string;
  email: string;
  role: AdminRole;
}): string {
  return jwt.sign(
    {
      sub: payload.id,
      email: payload.email,
      role: payload.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: ADMIN_TOKEN_TTL_SECONDS,
    }
  );
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;
}
