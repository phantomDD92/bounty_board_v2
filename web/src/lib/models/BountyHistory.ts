import mongoose, { Schema } from 'mongoose';

import type { Document, Model } from 'mongoose';

// Interface for a Comment
export interface IBountyHistory extends Document {
  text: string;
  creator: mongoose.Schema.Types.ObjectId; // Reference to the User model
  bounty: mongoose.Schema.Types.ObjectId; // Reference to the Bounty model
  createdAt: Date;
}

// Comment Schema
const BountyHistorySchema: Schema<IBountyHistory> = new Schema(
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
    bounty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bounty", // Reference to the Bounty model
      required: true,
    },
  },
  { timestamps: true }
);

// Export the Comment model
const BountyHistory: Model<IBountyHistory> = mongoose.models?.BountyHistory || mongoose.model<IBountyHistory>("BountyHistory", BountyHistorySchema);

export default BountyHistory;
