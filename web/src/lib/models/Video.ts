import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Video interface for TypeScript
export interface IVideo extends Document {
  createdAt: Date;
  url: string;
}

// Create the Mongoose schema for Video
const VideoSchema: Schema<IVideo> = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  url: {
    type: String,
    required: true,
    default: "#",
  },
});

// Export the model to prevent recompiling issues
const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
