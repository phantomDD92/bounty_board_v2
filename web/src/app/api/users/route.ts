import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import User, { Role } from '@/lib/models/User';
import { getSession } from "@/lib/session";

export async function GET() {
  await dbConnect();
  const session = await getSession();

  if (!session || !session.isAuth) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
  }

  if (session.role == Role.USER) {
    return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
  }

  const users = await User.find().sort({ createdAt: -1 });

  return NextResponse.json({ success: true, users });
}

