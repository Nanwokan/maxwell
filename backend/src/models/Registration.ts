import { Schema, model, models } from 'mongoose';

const registrationStatuses = ['new', 'validated', 'rejected', 'archived'] as const;

const registrationSchema = new Schema(
  {
    parentName: { type: String, required: true, trim: true },
    parentPhone: { type: String, required: true, trim: true },
    parentEmail: { type: String, required: true, trim: true, lowercase: true },
    childName: { type: String, required: true, trim: true },
    childAge: { type: Number, required: true, min: 4, max: 19 },
    categoryCode: { type: String, required: true, trim: true, uppercase: true },
    city: { type: String, trim: true },
    message: { type: String, trim: true },
    internalNotes: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: registrationStatuses, default: 'new' },
  },
  {
    timestamps: true,
  }
);

export const RegistrationModel =
  models.Registration || model('Registration', registrationSchema);
