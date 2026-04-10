import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../lib/async-handler';
import { contactRateLimit, registrationRateLimit } from '../../middlewares/rate-limit';
import { CategoryModel } from '../../models/Category';
import { ContactMessageModel } from '../../models/ContactMessage';
import { GalleryItemModel } from '../../models/GalleryItem';
import { HomepageContentModel } from '../../models/HomepageContent';
import { NewsPostModel } from '../../models/NewsPost';
import { PartnerModel } from '../../models/Partner';
import { RegistrationModel } from '../../models/Registration';
import { SiteSettingsModel } from '../../models/SiteSettings';
import { StaffMemberModel } from '../../models/StaffMember';

const contactPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(4000),
});

const registrationPayloadSchema = z.object({
  parentName: z.string().trim().min(2).max(120),
  parentPhone: z.string().trim().min(6).max(40),
  parentEmail: z.string().trim().email(),
  childName: z.string().trim().min(2).max(120),
  childAge: z.number().int().min(4).max(19),
  categoryCode: z.string().trim().min(2).max(12),
  city: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
});

export const publicRouter = Router();

publicRouter.get(
  '/site',
  asyncHandler(async (_req, res) => {
    const item = await SiteSettingsModel.findOne({ singletonKey: 'main' }).lean();
    res.json({ item });
  })
);

publicRouter.get(
  '/homepage',
  asyncHandler(async (_req, res) => {
    const [settings, homepage, categories, latestNews, staff, gallery, partners] = await Promise.all([
      SiteSettingsModel.findOne({ singletonKey: 'main' }).lean(),
      HomepageContentModel.findOne({ singletonKey: 'main' }).lean(),
      CategoryModel.find({ isActive: true }).sort({ sortOrder: 1, title: 1 }).lean(),
      NewsPostModel.find({ status: 'published' })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(3)
        .lean(),
      StaffMemberModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean(),
      GalleryItemModel.find({ isActive: true })
        .sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 })
        .limit(6)
        .lean(),
      PartnerModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    ]);

    res.json({
      item: {
        settings,
        homepage,
        categories,
        latestNews,
        staff,
        gallery,
        partners,
      },
    });
  })
);

publicRouter.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const items = await CategoryModel.find({ isActive: true })
      .sort({ sortOrder: 1, title: 1 })
      .lean();

    res.json({ items });
  })
);

publicRouter.get(
  '/news',
  asyncHandler(async (req, res) => {
    const requestedLimit =
      typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : 20;
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;

    const items = await NewsPostModel.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ items });
  })
);

publicRouter.get(
  '/news/:slug',
  asyncHandler(async (req, res) => {
    const item = await NewsPostModel.findOne({
      slug: req.params.slug,
      status: 'published',
    }).lean();

    if (!item) {
      res.status(404).json({ error: 'News post not found' });
      return;
    }

    res.json({ item });
  })
);

publicRouter.get(
  '/staff',
  asyncHandler(async (_req, res) => {
    const items = await StaffMemberModel.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    res.json({ items });
  })
);

publicRouter.get(
  '/gallery',
  asyncHandler(async (req, res) => {
    const category =
      typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : '';
    const requestedLimit =
      typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : null;
    const limit =
      requestedLimit && Number.isFinite(requestedLimit)
        ? Math.min(Math.max(requestedLimit, 1), 100)
        : undefined;

    const items = await GalleryItemModel.find({
      isActive: true,
      ...(category && category !== 'tout' ? { galleryCategory: category } : {}),
    })
      .sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 })
      .limit(limit ?? 0)
      .lean();

    res.json({ items });
  })
);

publicRouter.get(
  '/partners',
  asyncHandler(async (_req, res) => {
    const items = await PartnerModel.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    res.json({ items });
  })
);

publicRouter.post(
  '/contact',
  contactRateLimit,
  asyncHandler(async (req, res) => {
    const payload = contactPayloadSchema.parse(req.body);
    const item = await ContactMessageModel.create(payload);

    res.status(201).json({ ok: true, id: item.id });
  })
);

publicRouter.post(
  '/registrations',
  registrationRateLimit,
  asyncHandler(async (req, res) => {
    const payload = registrationPayloadSchema.parse(req.body);
    const item = await RegistrationModel.create({
      ...payload,
      categoryCode: payload.categoryCode.toUpperCase(),
    });

    res.status(201).json({ ok: true, id: item.id });
  })
);
