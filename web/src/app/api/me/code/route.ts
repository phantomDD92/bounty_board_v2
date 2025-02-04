import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Code from "@/lib/models/Code";

import { checkAuthenticated } from "@/utils/session";

// get code list for current user
export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const codes = await Code
      .find({ creator: session.userId })
      .populate('creator', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

