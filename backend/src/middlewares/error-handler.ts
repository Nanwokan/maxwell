import type { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { ZodError } from 'zod';

import { HttpError } from '../lib/http-error';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Invalid request payload',
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof MongoServerError && error.code === 11000) {
    res.status(409).json({ error: 'Resource already exists' });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}

