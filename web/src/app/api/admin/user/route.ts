import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';
import { getSession } from "@/lib/session";

import { checkAdmin, checkAuthenticated } from '@/utils/session';

export async function GET() {
  await dbConnect();
  const session = await getSession();

  if (!checkAuthenticated(session)) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
  }

  if (!checkAdmin(session)) {
    return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
  }

  const users = await User.find().sort({ createdAt: -1 });

  return NextResponse.json({ success: true, users });
}

