import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    adminUser?: {
      id: string;
      email: string;
      role: 'super_admin' | 'admin' | 'editor';
    };
  }
}
