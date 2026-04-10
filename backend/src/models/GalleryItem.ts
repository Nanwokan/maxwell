import { Schema, model, models } from 'mongoose';

const galleryCategories = ['matchs', 'entrainement', 'evenements'] as const;
const gallerySizes = ['small', 'medium', 'large'] as const;

const galleryItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    galleryCategory: { type: String, enum: galleryCategories, required: true },
    displaySize: { type: String, enum: gallerySizes, default: 'medium' },
    sortOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const GalleryItemModel =
  models.GalleryItem || model('GalleryItem', galleryItemSchema);

