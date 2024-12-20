// /app/api/users/userService.js
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongoose';

export const createUser = async ({ name, iaddress, role }: { name: string, iaddress: string, role: string }) => {
  try {
    await dbConnect();  // Ensure DB connection
    const user = new User({ name, iaddress, role });
    await user.save();
    return user;
  } catch (error: any) {
    throw new Error('Error creating user: ' + error.message);
  }
};

export const getUserById = async (id:string) => {
  try {
    await dbConnect();
    const user = await User.findById(id)
    return user;
  } catch (error: any) {
    throw new Error('Error finding user by id: ' + error.message);
  }
};

export const getUserByAddress = async (iaddress:string) => {
  try {
    await dbConnect();
    const user = await User.findOne({iaddress})
    return user;
  } catch (error: any) {
    throw new Error('Error finding user by iaddress: ' + error.message);
  }
};

export const isFirstUser = async () => {
  try {
    await dbConnect();
    const userCount = await User.countDocuments();
    return userCount == 0;
  } catch (error: any) {
    throw new Error('Error checking the first user: ' + error.message);
  }
}

const UserService = {
  createUser,
  getUserById,
  getUserByAddress,
  isFirstUser
}

export default UserService;
