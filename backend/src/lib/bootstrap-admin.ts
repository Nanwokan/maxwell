import { env } from '../config/env';
import { AdminUserModel } from '../models/AdminUser';
import { hashPassword } from './password';

export async function ensureBootstrapAdminUser(): Promise<void> {
  const email = env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.SEED_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.log('[api] admin bootstrap skipped (missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD)');
    return;
  }

  if (password.length < 12) {
    console.warn('[api] admin bootstrap skipped (SEED_ADMIN_PASSWORD must be at least 12 characters)');
    return;
  }

  const passwordHash = await hashPassword(password);
  const existing = await AdminUserModel.findOne({ email });

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = 'super_admin';
    existing.isActive = true;
    await existing.save();
    console.log(`[api] admin bootstrap synchronized user ${email}`);
    return;
  }

  await AdminUserModel.create({
    email,
    passwordHash,
    role: 'super_admin',
    isActive: true,
  });

  console.log(`[api] admin bootstrap created user ${email}`);
}
