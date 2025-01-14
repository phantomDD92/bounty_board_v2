import { NextResponse } from "next/server";

import moment from "moment";

import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from "@/lib/session";
import User from "@/lib/models/User";
import systemConfig from "@/configs/systemConfig";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.submittedAt && moment().diff(session.submittedAt, "minute") >= systemConfig.submissionInterval) {
      return NextResponse.json({ success: false, error: "Submission rate limited" }, { status: 403 })
    }

    await dbConnect();
    const { title, description, snippets } = await request.json();

    if (!description || !title) {
      return NextResponse.json({ success: false, message: "URL, Description is required" }, { status: 400 });
    }

    const newData = await Code.create({ title, description, snippets, creator: session.userId })
    await User.findByIdAndUpdate(session.userId, { $set: { submittedAt: new Date() } })

    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const codes = await Code.find().sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json({ success: true, codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

