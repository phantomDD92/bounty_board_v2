import { NextRequest, NextResponse } from 'next/server';
import { cancelLoginRequest, createLoginRequest, getLoginRequest } from '@/lib/verus';
import UserService from '@/lib/service/UserService';
import { Role } from '@/lib/models/User';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const data = await createLoginRequest();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { challenge } = await req.json();
    await cancelLoginRequest(challenge);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { challenge } = await req.json();
    const data = await getLoginRequest(challenge);
    if (!data) {
      return NextResponse.json({ success: false });
    }
    const {name, iaddress} = data;
    // check parameters validation
    if (!iaddress || !name) {
      return NextResponse.json({ success: false });
    }
    // find user, if not found, create a user
    let user = await UserService.getUserByAddress(iaddress);
    if (!user) {
      const isAdmin = await UserService.isFirstUser();
      const newUser = await UserService.createUser({ name, iaddress, role: isAdmin ? Role.ADMIN : Role.USER });
      await newUser.save();
      user = newUser
    }
    const response = NextResponse.json({ success: true });
    createSession(response, user);
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

