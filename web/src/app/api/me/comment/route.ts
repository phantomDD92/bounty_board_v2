import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Comment from "@/lib/models/Comment";

import { checkAuthenticated } from "@/utils/session";

// get comment list for admin
export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const comments = await Comment
      .find({ creator: session.userId })
      .populate('creator', 'name')
      .populate('bounty', 'title description')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

