import type { Request, RequestHandler } from 'express';

import { env } from '../config/env';

type KeyGenerator = (req: Request) => string;

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: KeyGenerator;
};

type HitRecord = {
  count: number;
  resetAt: number;
};

function getClientKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function createRateLimit(options: RateLimitOptions): RequestHandler {
  const hits = new Map<string, HitRecord>();
  let nextCleanupAt = Date.now() + options.windowMs;

  const cleanupExpired = (now: number): void => {
    if (now < nextCleanupAt) {
      return;
    }

    for (const [key, record] of hits.entries()) {
      if (record.resetAt <= now) {
        hits.delete(key);
      }
    }

    nextCleanupAt = now + options.windowMs;
  };

  return (req, res, next) => {
    if (!env.RATE_LIMIT_ENABLED || req.method === 'OPTIONS') {
      return next();
    }

    const now = Date.now();
    cleanupExpired(now);

    const key = options.keyGenerator ? options.keyGenerator(req) : getClientKey(req);
    const existing = hits.get(key);

    if (!existing || existing.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    existing.count += 1;
    if (existing.count > options.max) {
      return res.status(429).json({ error: options.message });
    }

    return next();
  };
}

export const globalApiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many requests, please try again later.',
});

export const loginRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, please try again later.',
  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : 'unknown';
    return `${getClientKey(req)}:${email}`;
  },
});

export const contactRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many contact messages sent, please try again later.',
});

export const registrationRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts, please try again later.',
});
