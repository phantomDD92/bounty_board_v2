import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { cancelLoginRequest, createLoginRequest, getLoginRequest } from '@/lib/verus';
import { getUserByAddress, isFirstUser, createUser } from '@/lib/service/UserService';
import { createSession } from '@/lib/session';
import { UserRole } from '@/types/enumTypes';

export async function POST() {
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
    const { exist, data } = await getLoginRequest(challenge);

    if (!data) {

      return NextResponse.json({ verus: exist ? 'pending' : 'cancel' });
    }

    const { name, iaddress } = data;


    // check parameters validation
    if (!iaddress || !name) {

      return NextResponse.json({ verus: 'error' });
    }


    // find user, if not found, create a user
    let user = await getUserByAddress(iaddress);

    if (!user) {
      const isFirst = await isFirstUser();
      const newUser = await createUser({ name, iaddress, role: isFirst ? UserRole.SUPER: UserRole.NORMAL });

      await newUser.save();
      user = newUser
    }

    const response = NextResponse.json({ verus: 'success' });

    createSession(response, user);

    return response;
  } catch (error) {

    return NextResponse.json({ verus: 'error', message: 'Internal server error' }, { status: 500 });
  }
}

