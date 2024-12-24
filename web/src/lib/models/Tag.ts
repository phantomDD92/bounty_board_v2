import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Tag interface for TypeScript
export interface ITag extends Document {
  _id: string; // Custom primary key as string
  name: string;
}

// Create the Mongoose schema for Tag
const TagSchema: Schema<ITag> = new Schema({
  _id: {
    type: String, // Set the _id type to string
    required: true, // Ensure the custom ID is required
  },
  name: {
    type: String,
    required: false,
    default: "",
    maxlength: 200,
  },
});

// Export the model to prevent recompiling issues
const Tag: Model<ITag> = mongoose.models?.Tag || mongoose.model<ITag>('Tag', TagSchema);

export default Tag;
