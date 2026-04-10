import { Schema, model, models } from 'mongoose';

const legalLinkSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const siteSettingsSchema = new Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },
    clubName: { type: String, required: true, trim: true, default: 'Association Sportive Maxwell Fae' },
    clubShortName: { type: String, trim: true, default: 'MF' },
    tagline: { type: String, trim: true },
    seasonLabel: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Côte d’Ivoire' },
    phonePrimary: { type: String, trim: true },
    phoneSecondary: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    facebookUrl: { type: String, trim: true },
    tiktokUrl: { type: String, trim: true },
    whatsappPhone: { type: String, trim: true },
    mapEmbedUrl: { type: String, trim: true },
    legalLinks: {
      type: [legalLinkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettingsModel =
  models.SiteSettings || model('SiteSettings', siteSettingsSchema);

