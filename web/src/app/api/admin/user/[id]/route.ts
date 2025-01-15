import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import { getSession } from '@/lib/session';
import User from '@/lib/models/User';
import { checkAuthenticated, checkSuperAdmin } from '@/utils/session';
import { UserRole } from '@/types/enumTypes';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkSuperAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const { id } = params;
    const { isAdmin } = await req.json();

    const updateUser = await User.findByIdAndUpdate(id, { $set: { role: isAdmin ? UserRole.ADMIN : UserRole.NORMAL } });

    if (!updateUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);

    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

