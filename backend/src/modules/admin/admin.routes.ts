import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../lib/async-handler';
import {
  ADMIN_AUTH_COOKIE_NAME,
  getAdminAuthCookieClearOptions,
  getAdminAuthCookieOptions,
} from '../../lib/auth-cookie';
import { type AdminRole, signAdminToken } from '../../lib/auth-token';
import { HttpError } from '../../lib/http-error';
import { ensureObjectId } from '../../lib/mongoose-utils';
import { hashPassword, verifyPassword } from '../../lib/password';
import { isSafeAnchorOrLink, isSafeHttpUrl, isSafeLink } from '../../lib/safe-url';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { loginRateLimit } from '../../middlewares/rate-limit';
import { AdminUserModel } from '../../models/AdminUser';
import { CategoryModel } from '../../models/Category';
import { ContactMessageModel } from '../../models/ContactMessage';
import { GalleryItemModel } from '../../models/GalleryItem';
import { HomepageContentModel } from '../../models/HomepageContent';
import { NewsPostModel } from '../../models/NewsPost';
import { PartnerModel } from '../../models/Partner';
import { RegistrationModel } from '../../models/Registration';
import { SiteSettingsModel } from '../../models/SiteSettings';
import { StaffMemberModel } from '../../models/StaffMember';

const adminRoleValues = ['super_admin', 'admin', 'editor'] as const;
const newsStatusValues = ['draft', 'published'] as const;
const contactStatusValues = ['new', 'read', 'replied', 'archived'] as const;
const registrationStatusValues = ['new', 'validated', 'rejected', 'archived'] as const;
const galleryCategoryValues = ['matchs', 'entrainement', 'evenements'] as const;
const gallerySizeValues = ['small', 'medium', 'large'] as const;

const adminRoleSchema = z.enum(adminRoleValues);
const newsStatusSchema = z.enum(newsStatusValues);
const contactStatusSchema = z.enum(contactStatusValues);
const registrationStatusSchema = z.enum(registrationStatusValues);
const galleryCategorySchema = z.enum(galleryCategoryValues);
const gallerySizeSchema = z.enum(gallerySizeValues);
const optionalEmailField = z.union([z.string().trim().email(), z.literal('')]).optional();
const optionalUrlField = z
  .union([z.string().trim(), z.literal('')])
  .refine((value) => value === '' || isSafeHttpUrl(value), 'Expected a valid http(s) URL')
  .optional();

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

const legalLinkSchema = z.object({
  label: z.string().trim().min(1).max(120),
  url: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .refine((value) => isSafeLink(value), 'Expected a valid relative or absolute URL'),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

const siteSettingsPatchSchema = z.object({
  clubName: z.string().trim().min(1).max(120).optional(),
  clubShortName: z.string().trim().max(20).optional(),
  tagline: z.string().trim().max(200).optional(),
  seasonLabel: z.string().trim().max(60).optional(),
  address: z.string().trim().max(200).optional(),
  city: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).optional(),
  phonePrimary: z.string().trim().max(40).optional(),
  phoneSecondary: z.string().trim().max(40).optional(),
  email: optionalEmailField,
  facebookUrl: optionalUrlField,
  tiktokUrl: optionalUrlField,
  whatsappPhone: z.string().trim().max(30).optional(),
  mapEmbedUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => value.length === 0 || isSafeHttpUrl(value), 'Expected a valid http(s) URL')
    .optional(),
  legalLinks: z.array(legalLinkSchema).optional(),
});

const ctaPatchSchema = z.object({
  label: z.string().trim().max(120).optional(),
  target: z
    .string()
    .trim()
    .max(200)
    .refine((value) => value.length === 0 || isSafeAnchorOrLink(value), 'Expected a valid link target')
    .optional(),
});

const statPatchSchema = z.object({
  label: z.string().trim().min(1).max(60),
  value: z.string().trim().min(1).max(30),
  iconKey: z.string().trim().max(40).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

const pillarPatchSchema = z.object({
  label: z.string().trim().min(1).max(60),
  description: z.string().trim().min(1).max(200),
  iconKey: z.string().trim().max(40).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

const schedulePatchSchema = z.object({
  timeLabel: z.string().trim().min(1).max(30),
  activity: z.string().trim().min(1).max(120),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

const heroPatchSchema = z.object({
  eyebrow: z.string().trim().max(80).optional(),
  titleMain: z.string().trim().max(80).optional(),
  titleAccent: z.string().trim().max(80).optional(),
  subtitle: z.string().trim().max(240).optional(),
  seasonLabel: z.string().trim().max(60).optional(),
  backgroundImageUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value.length === 0 || isSafeLink(value), 'Expected a valid image URL')
    .optional(),
  ctaPrimary: ctaPatchSchema.optional(),
  ctaSecondary: ctaPatchSchema.optional(),
});

const centerPatchSchema = z.object({
  eyebrow: z.string().trim().max(80).optional(),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().max(800).optional(),
  imageUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value.length === 0 || isSafeLink(value), 'Expected a valid image URL')
    .optional(),
  cta: ctaPatchSchema.optional(),
  stats: z.array(statPatchSchema).optional(),
});

const developmentPatchSchema = z.object({
  eyebrow: z.string().trim().max(80).optional(),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().max(800).optional(),
  imageUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value.length === 0 || isSafeLink(value), 'Expected a valid image URL')
    .optional(),
  cta: ctaPatchSchema.optional(),
  pillars: z.array(pillarPatchSchema).optional(),
});

const playerProfilePatchSchema = z.object({
  eyebrow: z.string().trim().max(80).optional(),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().max(800).optional(),
  imageUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value.length === 0 || isSafeLink(value), 'Expected a valid image URL')
    .optional(),
  cta: ctaPatchSchema.optional(),
  stats: z.array(statPatchSchema).optional(),
});

const trainingDayPatchSchema = z.object({
  eyebrow: z.string().trim().max(80).optional(),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().max(800).optional(),
  imageUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value.length === 0 || isSafeLink(value), 'Expected a valid image URL')
    .optional(),
  cta: ctaPatchSchema.optional(),
  schedule: z.array(schedulePatchSchema).optional(),
});

const homepagePatchSchema = z.object({
  hero: heroPatchSchema.optional(),
  center: centerPatchSchema.optional(),
  development: developmentPatchSchema.optional(),
  playerProfile: playerProfilePatchSchema.optional(),
  trainingDay: trainingDayPatchSchema.optional(),
});

const categoryCreateSchema = z.object({
  code: z.string().trim().min(2).max(12),
  title: z.string().trim().min(1).max(60),
  ageLabel: z.string().trim().min(1).max(40),
  description: z.string().trim().min(1).max(200),
  themeKey: z.string().trim().max(80).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isActive: z.boolean().optional(),
});

const categoryPatchSchema = categoryCreateSchema.partial();

const newsCreateSchema = z.object({
  title: z.string().trim().min(2).max(180),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().max(280).optional(),
  content: z.string().trim().max(10000).optional(),
  coverUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value.length === 0 || isSafeLink(value), 'Expected a valid image URL')
    .optional(),
  categoryLabel: z.string().trim().max(60).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  status: newsStatusSchema.optional(),
  publishedAt: z.union([z.string().datetime(), z.null()]).optional(),
});

const newsPatchSchema = newsCreateSchema.partial();

const staffCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  bio: z.string().trim().max(500).optional(),
  imageUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value.length === 0 || isSafeLink(value), 'Expected a valid image URL')
    .optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isActive: z.boolean().optional(),
});

const staffPatchSchema = staffCreateSchema.partial();

const galleryCreateSchema = z.object({
  title: z.string().trim().min(2).max(120),
  imageUrl: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .refine((value) => isSafeLink(value), 'Expected a valid image URL'),
  galleryCategory: galleryCategorySchema,
  displaySize: gallerySizeSchema.optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const galleryPatchSchema = galleryCreateSchema.partial();

const partnerCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  initials: z.string().trim().max(8).optional(),
  logoUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value.length === 0 || isSafeLink(value), 'Expected a valid image URL')
    .optional(),
  websiteUrl: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || isSafeHttpUrl(value), 'Expected a valid http(s) URL')
    .optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isActive: z.boolean().optional(),
});

const partnerPatchSchema = partnerCreateSchema.partial();

const contactMessagePatchSchema = z.object({
  status: contactStatusSchema.optional(),
});

const registrationPatchSchema = z.object({
  parentName: z.string().trim().min(2).max(120).optional(),
  parentPhone: z.string().trim().min(6).max(40).optional(),
  parentEmail: z.string().trim().email().optional(),
  childName: z.string().trim().min(2).max(120).optional(),
  childAge: z.number().int().min(4).max(19).optional(),
  categoryCode: z.string().trim().min(2).max(12).optional(),
  city: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  internalNotes: z.string().trim().max(2000).optional(),
  status: registrationStatusSchema.optional(),
});

const adminUserCreateSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(12).max(120),
  role: adminRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

const adminUserPatchSchema = z.object({
  email: z.string().trim().email().optional(),
  password: z.string().min(12).max(120).optional(),
  role: adminRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

const listQuerySchema = z.object({
  status: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

const contentRoles: AdminRole[] = ['super_admin', 'admin', 'editor'];
const adminRoles: AdminRole[] = ['super_admin', 'admin'];

function mergeDefined(target: unknown, patch: Record<string, unknown>): void {
  const mutableTarget = target as Record<string, unknown>;

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value) || value === null || typeof value !== 'object') {
      mutableTarget[key] = value;
      continue;
    }

    const current =
      typeof mutableTarget[key] === 'object' && mutableTarget[key] !== null && !Array.isArray(mutableTarget[key])
        ? (mutableTarget[key] as Record<string, unknown>)
        : {};

    mergeDefined(current, value as Record<string, unknown>);
    mutableTarget[key] = current;
  }
}

function sanitizeAdminUser(user: {
  _id?: unknown;
  id?: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date | null;
}) {
  return {
    id: user.id ?? String(user._id),
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt ?? null,
  };
}

function normalizeOptionalDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return new Date(value);
}

function getIdParam(value: string | string[] | undefined): string {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }
  throw new HttpError(400, 'Missing resource id');
}

export const adminRouter = Router();

adminRouter.post(
  '/auth/login',
  loginRateLimit,
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const user = await AdminUserModel.findOne({ email: payload.email.toLowerCase() });

    if (!user || !user.isActive) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const isValidPassword = await verifyPassword(payload.password, user.passwordHash);
    if (!isValidPassword) {
      throw new HttpError(401, 'Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAdminToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie(ADMIN_AUTH_COOKIE_NAME, token, getAdminAuthCookieOptions());

    res.json({
      user: sanitizeAdminUser(user),
      token,
    });
  })
);

adminRouter.post('/auth/logout', (_req, res) => {
  res.clearCookie(ADMIN_AUTH_COOKIE_NAME, getAdminAuthCookieClearOptions());
  res.status(204).send();
});

adminRouter.use(requireAuth);

adminRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const adminUserId = req.adminUser?.id;
    if (!adminUserId) {
      throw new HttpError(401, 'Unauthorized');
    }

    const user = await AdminUserModel.findById(adminUserId);
    if (!user || !user.isActive) {
      throw new HttpError(401, 'Unauthorized');
    }

    res.json({ user: sanitizeAdminUser(user) });
  })
);

adminRouter.get('/status', (req, res) => {
  res.json({
    ok: true,
    message: 'Admin API ready',
    user: req.adminUser ?? null,
  });
});

adminRouter.get(
  '/site-settings',
  requireRole(contentRoles),
  asyncHandler(async (_req, res) => {
    const item = await SiteSettingsModel.findOne({ singletonKey: 'main' }).lean();
    res.json({ item });
  })
);

adminRouter.patch(
  '/site-settings',
  requireRole(adminRoles),
  asyncHandler(async (req, res) => {
    const payload = siteSettingsPatchSchema.parse(req.body);
    const item =
      (await SiteSettingsModel.findOne({ singletonKey: 'main' })) ||
      new SiteSettingsModel({ singletonKey: 'main' });

    mergeDefined(item, payload);
    await item.save();

    res.json({ item });
  })
);

adminRouter.get(
  '/homepage',
  requireRole(contentRoles),
  asyncHandler(async (_req, res) => {
    const item = await HomepageContentModel.findOne({ singletonKey: 'main' }).lean();
    res.json({ item });
  })
);

adminRouter.patch(
  '/homepage',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = homepagePatchSchema.parse(req.body);
    const item =
      (await HomepageContentModel.findOne({ singletonKey: 'main' })) ||
      new HomepageContentModel({ singletonKey: 'main' });

    mergeDefined(item, payload);
    await item.save();

    res.json({ item });
  })
);

adminRouter.get(
  '/admin-users',
  requireRole(['super_admin']),
  asyncHandler(async (_req, res) => {
    const items = await AdminUserModel.find()
      .sort({ createdAt: 1 })
      .lean();

    res.json({ items: items.map((item) => sanitizeAdminUser(item as never)) });
  })
);

adminRouter.post(
  '/admin-users',
  requireRole(['super_admin']),
  asyncHandler(async (req, res) => {
    const payload = adminUserCreateSchema.parse(req.body);
    const item = await AdminUserModel.create({
      email: payload.email.toLowerCase(),
      passwordHash: await hashPassword(payload.password),
      role: payload.role ?? 'admin',
      isActive: payload.isActive ?? true,
    });

    res.status(201).json({ item: sanitizeAdminUser(item) });
  })
);

adminRouter.patch(
  '/admin-users/:id',
  requireRole(['super_admin']),
  asyncHandler(async (req, res) => {
    const payload = adminUserPatchSchema.parse(req.body);
    const item = await AdminUserModel.findById(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Admin user not found');
    }

    if (payload.email !== undefined) {
      item.email = payload.email.toLowerCase();
    }
    if (payload.role !== undefined) {
      item.role = payload.role;
    }
    if (payload.isActive !== undefined) {
      item.isActive = payload.isActive;
    }
    if (payload.password !== undefined) {
      item.passwordHash = await hashPassword(payload.password);
    }

    await item.save();
    res.json({ item: sanitizeAdminUser(item) });
  })
);

adminRouter.get(
  '/categories',
  requireRole(contentRoles),
  asyncHandler(async (_req, res) => {
    const items = await CategoryModel.find().sort({ sortOrder: 1, title: 1 }).lean();
    res.json({ items });
  })
);

adminRouter.post(
  '/categories',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = categoryCreateSchema.parse(req.body);
    const item = await CategoryModel.create({
      ...payload,
      code: payload.code.toUpperCase(),
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
    });

    res.status(201).json({ item });
  })
);

adminRouter.patch(
  '/categories/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = categoryPatchSchema.parse(req.body);
    const item = await CategoryModel.findById(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Category not found');
    }

    if (payload.code !== undefined) {
      item.code = payload.code.toUpperCase();
    }
    if (payload.title !== undefined) {
      item.title = payload.title;
    }
    if (payload.ageLabel !== undefined) {
      item.ageLabel = payload.ageLabel;
    }
    if (payload.description !== undefined) {
      item.description = payload.description;
    }
    if (payload.themeKey !== undefined) {
      item.themeKey = payload.themeKey;
    }
    if (payload.sortOrder !== undefined) {
      item.sortOrder = payload.sortOrder;
    }
    if (payload.isActive !== undefined) {
      item.isActive = payload.isActive;
    }

    await item.save();
    res.json({ item });
  })
);

adminRouter.delete(
  '/categories/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const item = await CategoryModel.findByIdAndDelete(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Category not found');
    }

    res.json({ ok: true });
  })
);

adminRouter.get(
  '/news',
  requireRole(contentRoles),
  asyncHandler(async (_req, res) => {
    const items = await NewsPostModel.find()
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    res.json({ items });
  })
);

adminRouter.post(
  '/news',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = newsCreateSchema.parse(req.body);
    const item = await NewsPostModel.create({
      title: payload.title,
      slug: payload.slug.toLowerCase(),
      excerpt: payload.excerpt,
      content: payload.content,
      coverUrl: payload.coverUrl,
      categoryLabel: payload.categoryLabel,
      tags: payload.tags ?? [],
      status: payload.status ?? 'draft',
      publishedAt:
        (payload.status ?? 'draft') === 'published'
          ? normalizeOptionalDate(payload.publishedAt) ?? new Date()
          : normalizeOptionalDate(payload.publishedAt) ?? null,
    });

    res.status(201).json({ item });
  })
);

adminRouter.patch(
  '/news/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = newsPatchSchema.parse(req.body);
    const item = await NewsPostModel.findById(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'News post not found');
    }

    if (payload.title !== undefined) {
      item.title = payload.title;
    }
    if (payload.slug !== undefined) {
      item.slug = payload.slug.toLowerCase();
    }
    if (payload.excerpt !== undefined) {
      item.excerpt = payload.excerpt;
    }
    if (payload.content !== undefined) {
      item.content = payload.content;
    }
    if (payload.coverUrl !== undefined) {
      item.coverUrl = payload.coverUrl;
    }
    if (payload.categoryLabel !== undefined) {
      item.categoryLabel = payload.categoryLabel;
    }
    if (payload.tags !== undefined) {
      item.tags = payload.tags;
    }
    if (payload.publishedAt !== undefined) {
      item.publishedAt = normalizeOptionalDate(payload.publishedAt) ?? null;
    }
    if (payload.status !== undefined) {
      item.status = payload.status;
      if (payload.status === 'published' && !item.publishedAt) {
        item.publishedAt = new Date();
      }
      if (payload.status === 'draft' && payload.publishedAt === undefined) {
        item.publishedAt = null;
      }
    }

    await item.save();
    res.json({ item });
  })
);

adminRouter.delete(
  '/news/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const item = await NewsPostModel.findByIdAndDelete(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'News post not found');
    }

    res.json({ ok: true });
  })
);

adminRouter.get(
  '/staff',
  requireRole(contentRoles),
  asyncHandler(async (_req, res) => {
    const items = await StaffMemberModel.find()
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    res.json({ items });
  })
);

adminRouter.post(
  '/staff',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = staffCreateSchema.parse(req.body);
    const item = await StaffMemberModel.create({
      ...payload,
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
    });

    res.status(201).json({ item });
  })
);

adminRouter.patch(
  '/staff/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = staffPatchSchema.parse(req.body);
    const item = await StaffMemberModel.findById(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Staff member not found');
    }

    Object.assign(item, payload);
    await item.save();
    res.json({ item });
  })
);

adminRouter.delete(
  '/staff/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const item = await StaffMemberModel.findByIdAndDelete(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Staff member not found');
    }

    res.json({ ok: true });
  })
);

adminRouter.get(
  '/gallery',
  requireRole(contentRoles),
  asyncHandler(async (_req, res) => {
    const items = await GalleryItemModel.find()
      .sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 })
      .lean();
    res.json({ items });
  })
);

adminRouter.post(
  '/gallery',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = galleryCreateSchema.parse(req.body);
    const item = await GalleryItemModel.create({
      ...payload,
      displaySize: payload.displaySize ?? 'medium',
      sortOrder: payload.sortOrder ?? 0,
      isFeatured: payload.isFeatured ?? false,
      isActive: payload.isActive ?? true,
    });

    res.status(201).json({ item });
  })
);

adminRouter.patch(
  '/gallery/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = galleryPatchSchema.parse(req.body);
    const item = await GalleryItemModel.findById(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Gallery item not found');
    }

    Object.assign(item, payload);
    await item.save();
    res.json({ item });
  })
);

adminRouter.delete(
  '/gallery/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const item = await GalleryItemModel.findByIdAndDelete(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Gallery item not found');
    }

    res.json({ ok: true });
  })
);

adminRouter.get(
  '/partners',
  requireRole(contentRoles),
  asyncHandler(async (_req, res) => {
    const items = await PartnerModel.find()
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    res.json({ items });
  })
);

adminRouter.post(
  '/partners',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = partnerCreateSchema.parse(req.body);
    const item = await PartnerModel.create({
      ...payload,
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
    });

    res.status(201).json({ item });
  })
);

adminRouter.patch(
  '/partners/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const payload = partnerPatchSchema.parse(req.body);
    const item = await PartnerModel.findById(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Partner not found');
    }

    Object.assign(item, payload);
    await item.save();
    res.json({ item });
  })
);

adminRouter.delete(
  '/partners/:id',
  requireRole(contentRoles),
  asyncHandler(async (req, res) => {
    const item = await PartnerModel.findByIdAndDelete(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Partner not found');
    }

    res.json({ ok: true });
  })
);

adminRouter.get(
  '/contact-messages',
  requireRole(adminRoles),
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);
    const normalizedStatus = query.status ? contactStatusSchema.parse(query.status.toLowerCase()) : undefined;
    const skip = (query.page - 1) * query.limit;
    const filters = normalizedStatus ? { status: normalizedStatus } : {};

    const [items, total] = await Promise.all([
      ContactMessageModel.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),
      ContactMessageModel.countDocuments(filters),
    ]);

    res.json({
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    });
  })
);

adminRouter.patch(
  '/contact-messages/:id',
  requireRole(adminRoles),
  asyncHandler(async (req, res) => {
    const payload = contactMessagePatchSchema.parse(req.body);
    const item = await ContactMessageModel.findById(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Contact message not found');
    }

    Object.assign(item, payload);
    await item.save();
    res.json({ item });
  })
);

adminRouter.get(
  '/registrations',
  requireRole(adminRoles),
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);
    const normalizedStatus = query.status ? registrationStatusSchema.parse(query.status.toLowerCase()) : undefined;
    const skip = (query.page - 1) * query.limit;
    const filters = normalizedStatus ? { status: normalizedStatus } : {};

    const [items, total] = await Promise.all([
      RegistrationModel.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),
      RegistrationModel.countDocuments(filters),
    ]);

    res.json({
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    });
  })
);

adminRouter.patch(
  '/registrations/:id',
  requireRole(adminRoles),
  asyncHandler(async (req, res) => {
    const payload = registrationPatchSchema.parse(req.body);
    const item = await RegistrationModel.findById(ensureObjectId(getIdParam(req.params.id)));
    if (!item) {
      throw new HttpError(404, 'Registration not found');
    }

    if (payload.categoryCode !== undefined) {
      item.categoryCode = payload.categoryCode.toUpperCase();
    }

    Object.assign(item, {
      ...payload,
      ...(payload.categoryCode !== undefined ? { categoryCode: payload.categoryCode.toUpperCase() } : {}),
    });
    await item.save();
    res.json({ item });
  })
);
