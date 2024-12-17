import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the User interface for TypeScript
export interface IUser extends Document {
  iaddress: string;
  name: string;
}

// Create the Mongoose schema for User
const UserSchema: Schema<IUser> = new Schema({
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
});

// Export the model to avoid recompiling issues
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
