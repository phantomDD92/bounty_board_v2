import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Bounty from "@/lib/models/Bounty";

import { checkAuthenticated } from "@/utils/session";

// get infra list for current user
export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const infra = await Bounty.find({ creator: session.userId }).populate('creator').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, infra });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

