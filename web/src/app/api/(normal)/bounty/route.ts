import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Bounty from "@/lib/models/Bounty";
import User from "@/lib/models/User";
import { checkAuthenticated, checkRateLimited } from "@/utils/session";
import { PublishStatus } from "@/types/enumTypes";

// create bounty
export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkRateLimited(session)) {
      return NextResponse.json({ success: false, message: "Submission rate limited" }, { status: 403 })
    }

    const { title, description, skills, reward, deadline, phone, email } = await request.json();

    if (!description || !title || !skills || !reward || !deadline) {
      return NextResponse.json({ success: false, message: "All parameters are required" }, { status: 400 });
    }

    const newData = await Bounty.create({ title, description, skills, reward, deadline, phone, email, status: PublishStatus.PENDING, creator: session?.userId });

    await User.findByIdAndUpdate(session?.userId, { $set: { submittedAt: new Date() } })

    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {

    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// get bounty list
export async function GET() {
  try {
    // const searchParams = request.nextUrl.searchParams;

    await dbConnect();

    const bounties = await Bounty.find({ status: PublishStatus.APPROVED })
      .populate("creator", "name")
      .populate("skills")

    // .sort(sort)
    // .skip((parseInt(page) - 1) * parseInt(size))
    // .limit(parseInt(size)); // Sort by newest first

    return NextResponse.json({ success: true, bounties });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

