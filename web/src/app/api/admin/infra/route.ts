import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Infra from "@/lib/models/Infra";

import { checkAdmin, checkAuthenticated } from "@/utils/session";

// get code list for admin
export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const infra = await Infra.find().populate('creator').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, infra });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

