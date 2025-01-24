import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from "@/lib/session";
import User from "@/lib/models/User";

import { checkAuthenticated, checkRateLimited } from "@/utils/session";
import { PublishStatus } from "@/types/enumTypes";

// create code
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
    const { title, description, snippets } = await request.json();

    if (!description || !title) {
      return NextResponse.json({ success: false, message: "URL, Description is required" }, { status: 400 });
    }

    await Code.create({ title, description, snippets, creator: session.userId, status: PublishStatus.PENDING })
    await User.findByIdAndUpdate(session?.userId, { $set: { submittedAt: new Date() } })

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// get code list
export async function GET() {
  try {
    await dbConnect();

    const codes = await Code
      .find({ status: PublishStatus.APPROVED })
      .populate('creator', 'name')
      .sort({ weight: -1, createdAt: -1 }); // Sort by newest first

    return NextResponse.json({ success: true, codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

