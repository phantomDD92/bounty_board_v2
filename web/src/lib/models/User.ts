import mongoose, { Schema } from 'mongoose';

import type { Document, Model } from 'mongoose';

import { UserRole } from '@/types/enumTypes';

// Define the User interface for TypeScript
export interface IUser extends Document {
  _id: string,
  iaddress: string;
  name: string;
  role: number;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for User
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: false,
      default: ""
    },
    iaddress: {
      type: String,
      required: false,
      default: ""
    },
    role: {
      type: Number,
      enum: Object.values(UserRole),
      default: UserRole.NORMAL,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Export the model to avoid recompiling issues
const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default User;
