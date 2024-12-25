import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Role } from '@/lib/models/User';
import { createSession } from '@/lib/session';
import UserService from '@/lib/service/UserService';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { iaddress, name } = await req.json();
    // check parameters validation
    if (!iaddress || !name) {
      return NextResponse.json({ message: "IAddress, Name are required." }, { status: 400 });
    }
    // find user, if not found, create a user
    let user = await UserService.getUserByAddress(iaddress);
    if (!user) {
      const isAdmin = await UserService.isFirstUser();
      const newUser = await UserService.createUser({name, iaddress, role: isAdmin ? Role.ADMIN: Role.USER});
      await newUser.save();
      user = newUser
    }
    const response = NextResponse.json({ success: true });
    // create session
    createSession(response, user);
    return response;
  } catch (error) {
    console.error('Error creating infra:', error);
    return NextResponse.json({ message: 'Server error occurred' }, { status: 500 });
  }
}
