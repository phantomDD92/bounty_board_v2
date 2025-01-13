import mongoose, { Schema } from 'mongoose';

import type { Document, Model} from 'mongoose';

// Define the Infra interface for TypeScript
export interface IInfra extends Document {
  title: string;
  description: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for Infra
const InfraSchema: Schema<IInfra> = new Schema(
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
    url: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    timestamps: true
  }
);

// Export the model to prevent recompiling issues
const Infra: Model<IInfra> = mongoose.models?.Infra || mongoose.model<IInfra>('Infra', InfraSchema);

export default Infra;
