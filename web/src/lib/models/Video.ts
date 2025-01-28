import mongoose, { Schema } from 'mongoose';

import type { Document, Model } from 'mongoose';

import { Status } from '@/types/enumTypes';

// Define the Video interface for TypeScript
export interface IVideo extends Document {
  url: string;
  title: string;
  description: string;
  creator: mongoose.Schema.Types.ObjectId,
  weight: number,
  status: number,
  feedback: string,
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for Video
const VideoSchema: Schema<IVideo> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      default: "#",
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
      enum: Object.values(Status),
      default: Status.PENDING,
    },
  },
  {
    timestamps: true
  }
);

// Export the model to prevent recompiling issues
const Video: Model<IVideo> = mongoose.models?.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
