import mongoose, { Schema, Document, Model } from "mongoose";

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
  TO_DO: "TO_DO",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

export const RewardType = {
  FIXED: "FIXED",
  VARIABLE: "VARIABLE",
};

export const Token = {
  USDC: "USDC",
  ETH: "ETH",
  BTC: "BTC",
};

// Bounty Interface for TypeScript
export interface IBounty extends Document {
  title: string;
  description: string;
  creator: IUser["_id"];
  discord: string;
  point: number;
  status: string;
  isAuction: boolean;
  rewardAmount: number;
  rewardType: string;
  rewardToken: string;
  tags: ITag["_id"][]; // Array of tag IDs
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Bounty
const BountySchema: Schema<IBounty> = new Schema(
  {
    discord: {
      type: String,
      required: true,
      default: "",
    },
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
    point: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(BountyStatus),
      default: BountyStatus.TO_DO,
    },
    isAuction: {
      type: Boolean,
      default: false,
    },
    rewardAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    rewardType: {
      type: String,
      enum: Object.values(RewardType),
      default: RewardType.FIXED,
    },
    rewardToken: {
      type: String,
      enum: Object.values(Token),
      default: Token.USDC,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag", // Reference to the Tag model
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Export the model
const Bounty: Model<IBounty> = mongoose.models.Bounty || mongoose.model<IBounty>("Bounty", BountySchema);

export default Bounty;
