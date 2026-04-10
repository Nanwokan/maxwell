import { Schema, model, models } from 'mongoose';

const newsStatuses = ['draft', 'published'] as const;

const newsPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, trim: true },
    content: { type: String, trim: true },
    coverUrl: { type: String, trim: true },
    categoryLabel: { type: String, trim: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: newsStatuses, default: 'draft' },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const NewsPostModel = models.NewsPost || model('NewsPost', newsPostSchema);

