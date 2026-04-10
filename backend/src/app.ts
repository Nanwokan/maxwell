import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler } from './middlewares/error-handler';
import { notFoundHandler } from './middlewares/not-found';
import { globalApiRateLimit } from './middlewares/rate-limit';
import { adminRouter } from './modules/admin/admin.routes';
import { healthRouter } from './modules/health/health.routes';
import { publicRouter } from './modules/public/public.routes';

export const app = express();

function isLocalDevelopmentOrigin(origin: string) {
  try {
    const parsedOrigin = new URL(origin);
    const isLocalHost =
      parsedOrigin.hostname === 'localhost' || parsedOrigin.hostname === '127.0.0.1';

    return parsedOrigin.protocol === 'http:' && isLocalHost;
  } catch {
    return false;
  }
}

function isAllowedOrigin(origin?: string) {
  if (!origin) {
    return true;
  }

  if (env.CORS_ORIGINS.includes(origin)) {
    return true;
  }

  if (env.NODE_ENV !== 'production' && isLocalDevelopmentOrigin(origin)) {
    return true;
  }

  return false;
}

if (env.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin ?? 'unknown'} is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(globalApiRateLimit);
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (_req, res) => {
  res.json({
    name: 'Maxwell Backend API',
    ok: true,
  });
});

app.use('/api/health', healthRouter);
app.use('/api/public', publicRouter);
app.use('/api/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);
