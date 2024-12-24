import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/mongoose';
import Bounty from "@/lib/models/Bounty";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id: bountyId } = params;
    const bounty = await Bounty.findById(bountyId)
      .populate("creator", "name iaddress")
      .populate("skills");
    return NextResponse.json({ success: true, bounty });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

