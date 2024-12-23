import mongoose, { Schema, Document, Model } from "mongoose";
import { IComment } from "./Comment";

// Interfaces for referenced fields
interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  iaddress: string;
  name: string;
}

interface ITag {
  _id: string;
  name: string;
}

// Enum-like options for status, reward type, and token
export const BountyStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};


// Bounty Interface for TypeScript
export interface IBounty extends Document {
  title: string;
  description: string;
  skills: ITag["_id"][]; // Array of tag IDs
  creator: IUser["_id"];
  reward: string;
  deadline: Date;
  contact: string,
  feedback: string,
  status: string;
  comments: IComment["_id"][]
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
      type: String,
      enum: Object.values(BountyStatus),
      default: BountyStatus.PENDING,
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
    contact: {
      type: String,
      required: true,
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
