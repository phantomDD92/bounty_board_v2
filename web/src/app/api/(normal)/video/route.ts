import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Video from '@/lib/models/Video';
import User from "@/lib/models/User";

import { getSession } from "@/lib/session";

import { checkAuthenticated, checkRateLimited } from "@/utils/session";
import { Status } from "@/types/enumTypes";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkRateLimited(session)) {
      return NextResponse.json({ success: false, message: "Submission rate limited" }, { status: 403 })
    }

    await dbConnect();
    const { title, url, description } = await request.json();

    if (!url || !title) {
      return NextResponse.json({ success: false, message: "URL, Title is required" }, { status: 400 });
    }

    await Video.create({ title, url, description, creator: session.userId })
    await User.findByIdAndUpdate(session.userId, { $set: { submittedAt: new Date() } })

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const videos = await Video
      .find({ status: Status.OPEN })
      .populate('creator', 'name')
      .sort({ weight: -1, createdAt: -1 }); // Sort by newest first

    return NextResponse.json({ success: true, videos });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

