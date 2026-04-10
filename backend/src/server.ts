import { app } from './app';
import { connectToDatabase, disconnectFromDatabase } from './config/database';
import { env } from './config/env';

let server: ReturnType<typeof app.listen> | null = null;

async function bootstrap(): Promise<void> {
  await connectToDatabase();

  server = app.listen(env.PORT, () => {
    console.log(`[api] listening on port ${env.PORT}`);
  });
}

async function shutdown(signal: string): Promise<void> {
  console.log(`[api] received ${signal}, shutting down`);

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  await disconnectFromDatabase();
  process.exit(0);
}

void bootstrap().catch((error) => {
  console.error('[api] failed to start', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
