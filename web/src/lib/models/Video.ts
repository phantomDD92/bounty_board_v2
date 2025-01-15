import mongoose, { Schema } from 'mongoose';

import type { Document, Model } from 'mongoose';

import { PublishStatus } from '@/types/enumTypes';

// Define the Video interface for TypeScript
export interface IVideo extends Document {
  url: string;
  title: string;
  creator: mongoose.Schema.Types.ObjectId,
  status: number,
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
const Video: Model<IVideo> = mongoose.models?.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
