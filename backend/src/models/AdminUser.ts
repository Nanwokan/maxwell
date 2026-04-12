import { Schema, model, models } from 'mongoose';

const adminRoles = ['super_admin', 'admin', 'editor'] as const;

const adminUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: adminRoles,
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    passwordResetCodeHash: {
      type: String,
      default: null,
    },
    passwordResetCodeExpiresAt: {
      type: Date,
      default: null,
    },
    passwordResetSessionHash: {
      type: String,
      default: null,
    },
    passwordResetSessionExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const AdminUserModel = models.AdminUser || model('AdminUser', adminUserSchema);
