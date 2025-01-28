import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Social from "@/lib/models/Social";

import { checkAuthenticated } from "@/utils/session";

// get video list for current user
export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const socials = await Social.find({ creator: session.userId }).populate('creator').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, socials });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

