import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Bounty from "@/lib/models/Bounty";
import { Role } from "@/lib/models/User";

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.role != Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const bounties = await Bounty.find().populate('creator').sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json({ success: true, bounties });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

