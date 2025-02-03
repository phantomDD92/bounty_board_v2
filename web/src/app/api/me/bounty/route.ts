import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Bounty from "@/lib/models/Bounty";

import { checkAuthenticated } from "@/utils/session";

// get bounty list for current user
export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const bounties = await Bounty
      .find({ creator: session.userId })
      .populate('creator', 'name')
      .populate('assignee', 'name')
      .populate('skills', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bounties });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

