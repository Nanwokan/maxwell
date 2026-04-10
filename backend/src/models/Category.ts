import { Schema, model, models } from 'mongoose';

const categorySchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    title: { type: String, required: true, trim: true },
    ageLabel: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    themeKey: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = models.Category || model('Category', categorySchema);

