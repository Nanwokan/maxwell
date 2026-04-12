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
  SMTP_HOST: z.string().trim().optional(),
  SMTP_PORT: z.preprocess(
    (value) => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        return undefined;
      }
      return Number(value);
    },
    z.number().int().positive().optional()
  ),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }
      return value === 'true' || value === '1' || value === 'yes';
    }),
  SMTP_USER: z.string().trim().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().trim().email().optional(),
  SMTP_FROM_NAME: z.string().trim().optional(),
  SEED_ADMIN_EMAIL: z.string().trim().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
});

const parsed = rawEnvSchema.parse(process.env);

export const env = {
  ...parsed,
  SMTP_SECURE: parsed.SMTP_SECURE ?? (parsed.SMTP_PORT === 465),
  RATE_LIMIT_ENABLED:
    parsed.RATE_LIMIT_ENABLED ?? (parsed.NODE_ENV === 'test' ? false : true),
  CORS_ORIGINS: parsed.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type AppEnv = typeof env;
