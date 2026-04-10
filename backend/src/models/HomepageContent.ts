import { Schema, model, models } from 'mongoose';

const ctaSchema = new Schema(
  {
    label: { type: String, trim: true },
    target: { type: String, trim: true },
  },
  { _id: false }
);

const statSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    iconKey: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const pillarSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    iconKey: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const scheduleSchema = new Schema(
  {
    timeLabel: { type: String, required: true, trim: true },
    activity: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const homepageContentSchema = new Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },
    hero: {
      eyebrow: { type: String, trim: true },
      titleMain: { type: String, trim: true },
      titleAccent: { type: String, trim: true },
      subtitle: { type: String, trim: true },
      seasonLabel: { type: String, trim: true },
      backgroundImageUrl: { type: String, trim: true },
      ctaPrimary: { type: ctaSchema, default: {} },
      ctaSecondary: { type: ctaSchema, default: {} },
    },
    center: {
      eyebrow: { type: String, trim: true },
      title: { type: String, trim: true },
      body: { type: String, trim: true },
      imageUrl: { type: String, trim: true },
      cta: { type: ctaSchema, default: {} },
      stats: { type: [statSchema], default: [] },
    },
    development: {
      eyebrow: { type: String, trim: true },
      title: { type: String, trim: true },
      body: { type: String, trim: true },
      imageUrl: { type: String, trim: true },
      cta: { type: ctaSchema, default: {} },
      pillars: { type: [pillarSchema], default: [] },
    },
    playerProfile: {
      eyebrow: { type: String, trim: true },
      title: { type: String, trim: true },
      body: { type: String, trim: true },
      imageUrl: { type: String, trim: true },
      cta: { type: ctaSchema, default: {} },
      stats: { type: [statSchema], default: [] },
    },
    trainingDay: {
      eyebrow: { type: String, trim: true },
      title: { type: String, trim: true },
      body: { type: String, trim: true },
      imageUrl: { type: String, trim: true },
      cta: { type: ctaSchema, default: {} },
      schedule: { type: [scheduleSchema], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

export const HomepageContentModel =
  models.HomepageContent || model('HomepageContent', homepageContentSchema);

