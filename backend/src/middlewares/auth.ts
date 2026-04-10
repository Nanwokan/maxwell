import type { NextFunction, Request, Response } from 'express';

import { extractAdminToken } from '../lib/auth-cookie';
import { type AdminRole, verifyAdminToken } from '../lib/auth-token';

const validRoles = new Set<AdminRole>(['super_admin', 'admin', 'editor']);

export function requireAuth(req: Request, res: Response, next: NextFunction): Response | void {
  const token = extractAdminToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = verifyAdminToken(token);
    if (!payload.sub || !payload.email || !payload.role || !validRoles.has(payload.role)) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.adminUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(roles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.adminUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.adminUser.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return next();
  };
}
