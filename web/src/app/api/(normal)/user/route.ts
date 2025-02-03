import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';
import { getSession } from "@/lib/session";

import { checkAuthenticated } from '@/utils/session';

export async function GET() {
  await dbConnect();
  const session = await getSession();

  if (!checkAuthenticated(session)) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
  }

  const users = await User.find({}, 'name').sort({ name: -1 });

  return NextResponse.json({ success: true, users });
}

