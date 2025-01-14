import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import { getSession } from '@/lib/session';
import User, { Role } from '@/lib/models/User';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.role != Role.SUPER) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const { id } = params;
    const { isAdmin } = await req.json();

    const updateUser = await User.findByIdAndUpdate(id, { $set : { role: isAdmin ? Role.ADMIN : Role.USER}});

    if (!updateUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);

    return NextResponse.json({ success: false, error: "Server error occurred" }, { status: 500 });
  }
}

