import 'dotenv/config';

import { z } from 'zod';

const rawEnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((value) => value === 'true' || value === '1' || value === 'yes'),
  RATE_LIMIT_ENABLED: z
    .string()
    .optional()
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }
      return value === 'true' || value === '1' || value === 'yes';
    }),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  SEED_ADMIN_EMAIL: z.string().trim().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
});

const parsed = rawEnvSchema.parse(process.env);

export const env = {
  ...parsed,
  RATE_LIMIT_ENABLED:
    parsed.RATE_LIMIT_ENABLED ?? (parsed.NODE_ENV === 'test' ? false : true),
  CORS_ORIGINS: parsed.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type AppEnv = typeof env;
