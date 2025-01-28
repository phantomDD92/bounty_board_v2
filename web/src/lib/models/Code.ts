import mongoose, { Schema } from 'mongoose';

import type { Document, Model } from 'mongoose';

import { Language, Status } from '@/types/enumTypes';

// Define the Code interface for TypeScript
export interface ICode extends Document {
  title: string;
  description: string;
  creator: mongoose.Schema.Types.ObjectId,
  weight: number,
  status: number,
  feedback: string,
  snippets: [{
    language: string;
    code: string;
  }];
  createdAt: Date;
  updatedAt: Date;
}


// Create the Mongoose schema for Code
const CodeSchema: Schema<ICode> = new Schema(
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
    weight: {
      type: Number,
      default: 1,
    },
    feedback: {
      type: String,
      default: "",
    },
    snippets: [{
      language: {
        type: String,
        enum: Object.values(Language),
        default: Language.JAVASCRIPT
      },
      code: { type: String },
    }],
  },
  {
    timestamps: true
  }
);

// Export the model to prevent recompiling issues
const Code: Model<ICode> = mongoose.models?.Code || mongoose.model<ICode>('Code', CodeSchema);

export default Code;
