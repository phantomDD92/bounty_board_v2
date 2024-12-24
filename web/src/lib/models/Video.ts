import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Video interface for TypeScript
export interface IVideo extends Document {
  createdAt: Date;
  url: string;
  title: string;
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
  },
  {
    timestamps: true
  }
);

// Export the model to prevent recompiling issues
const Video: Model<IVideo> = mongoose.models?.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
