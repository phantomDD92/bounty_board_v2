import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User, { IUser, Role } from '@/lib/models/User';
import { signToken } from '@/lib/auth';
import { withAuthorization } from '@/lib/middleware';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { iaddress, name } = await req.json();

    if (!iaddress || !name) {
      return NextResponse.json({ message: "IAddress, Name are required." }, { status: 400 });
    }
    const users = await User.find({});
    let admin = false;
    if (users && users.length == 0) {
      admin = true;
    }
    const newUser = new User({ iaddress, name, role: admin ? Role.ADMIN : Role.USER });
    await newUser.save();
    const token = await signToken({ id: newUser._id });
    return NextResponse.json({ message: 'Infra created successfully', token });
  } catch (error) {
    console.error('Error creating infra:', error);
    return NextResponse.json({ message: 'Server error occurred' }, { status: 500 });
  }
}

async function getMe(request: NextRequest, user: IUser) {
  return NextResponse.json({ message: 'success', user });
}

export const GET = withAuthorization(getMe);
