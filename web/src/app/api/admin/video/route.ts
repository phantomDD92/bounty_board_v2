import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Video from "@/lib/models/Video";
import { getSession } from "@/lib/session";

import { checkAdmin, checkAuthenticated } from "@/utils/session";

// get video list for admin
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

    const videos = await Video.find().populate('creator').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, videos });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

