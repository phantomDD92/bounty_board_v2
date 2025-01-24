import mongoose, { Schema } from 'mongoose';

import type { Document, Model } from 'mongoose';

import { PublishStatus } from '@/types/enumTypes';

// Define the Infra interface for TypeScript
export interface IInfra extends Document {
  title: string;
  description: string;
  url: string;
  creator: mongoose.Schema.Types.ObjectId,
  weight: number,
  status: number,
  feedback:string,
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for Infra
const InfraSchema: Schema<IInfra> = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    url: {
      type: String,
      required: true,
      default: '',
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
    weight: {
      type: Number,
      default: 1,
    },
    status: {
      type: Number,
      enum: Object.values(PublishStatus),
      default: PublishStatus.PENDING,
    },
  },
  {
    timestamps: true
  }
);

// Export the model to prevent recompiling issues
const Infra: Model<IInfra> = mongoose.models?.Infra || mongoose.model<IInfra>('Infra', InfraSchema);

export default Infra;
