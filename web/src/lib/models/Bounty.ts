import mongoose, { Schema } from 'mongoose';

import type { Document, Model } from 'mongoose';

import { PublishStatus } from '@/types/enumTypes';

import { ITag } from './Tag';

// Bounty Interface for TypeScript
export interface IBounty extends Document {
  title: string;
  description: string;
  skills: string[]; // Array of tag IDs
  creator: mongoose.Schema.Types.ObjectId,
  reward: string;
  deadline: Date;
  phone: string,
  email: string,
  feedback: string,
  status: number;
  comments: mongoose.Schema.Types.ObjectId[]
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Bounty
const BountySchema: Schema<IBounty> = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    feedback: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      enum: Object.values(PublishStatus),
      default: PublishStatus.PENDING,
    },
    reward: {
      type: String,
      required: true,
      default: "",
    },
    deadline: {
      type: Date,
      required: true
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
        ref: "Tag", // Reference to the Tag model
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to the Tag model
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Export the model
const Bounty: Model<IBounty> = mongoose.models?.Bounty || mongoose.model<IBounty>("Bounty", BountySchema);

export default Bounty;
