import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Social from "@/lib/models/Social";
import { getSession } from "@/lib/session";

import { checkAdmin, checkAuthenticated } from "@/utils/session";

// get social list for admin
export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const socials = await Social.find().populate('creator').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, socials });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

