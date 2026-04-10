import { Schema, model, models } from 'mongoose';

const partnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    initials: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    websiteUrl: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const PartnerModel = models.Partner || model('Partner', partnerSchema);
