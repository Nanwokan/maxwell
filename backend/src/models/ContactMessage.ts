import { Schema, model, models } from 'mongoose';

const contactStatuses = ['new', 'read', 'replied', 'archived'] as const;

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: contactStatuses, default: 'new' },
  },
  {
    timestamps: true,
  }
);

export const ContactMessageModel =
  models.ContactMessage || model('ContactMessage', contactMessageSchema);

