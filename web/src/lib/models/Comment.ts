import mongoose, { Schema } from 'mongoose';

import type { Document, Model } from 'mongoose';

import { Status } from '@/types/enumTypes';

// Interface for a Comment
export interface IComment extends Document {
  text: string;
  creator: mongoose.Schema.Types.ObjectId; // Reference to the User model
  bounty: mongoose.Schema.Types.ObjectId; // Reference to the Bounty model
  status: number,
  createdAt: Date;
}

// Comment Schema
const CommentSchema: Schema<IComment> = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    status: {
      type: Number,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    bounty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bounty", // Reference to the Bounty model
      required: true,
    },
  },
  { timestamps: true }
);

// Export the Comment model
const Comment: Model<IComment> = mongoose.models?.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
