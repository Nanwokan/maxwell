import { Schema, model, models } from 'mongoose';

const staffMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const StaffMemberModel =
  models.StaffMember || model('StaffMember', staffMemberSchema);

