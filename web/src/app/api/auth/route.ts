import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import { createSession } from '@/lib/session';
import {createUser, getUserByAddress, isFirstUser} from '@/lib/service/UserService';
import { UserRole } from '@/types/enumTypes';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { iaddress, name } = await req.json();

    // check parameters validation
    if (!iaddress || !name) {

      return NextResponse.json({ message: "IAddress, Name are required." }, { status: 400 });
    }

    // find user, if not found, create a user
    let user = await getUserByAddress(iaddress);

    if (!user) {
      const isFirst = await isFirstUser();
      const newUser = await createUser({name, iaddress, role: isFirst ? UserRole.SUPER: UserRole.NORMAL});

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
