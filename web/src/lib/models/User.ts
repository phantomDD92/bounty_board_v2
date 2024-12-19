import mongoose, { Schema, Document, Model } from 'mongoose';

export const Role = {
  ADMIN: "admin",
  USER: "user",
};

// Define the User interface for TypeScript
export interface IUser extends Document {
  _id: string,
  iaddress: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for User
const UserSchema: Schema<IUser> = new Schema(
  {
    iaddress: {
      type: String,
      required: false,
      default: ""
    },
    name: {
      type: String,
      required: false,
      default: ""
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Export the model to avoid recompiling issues
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
