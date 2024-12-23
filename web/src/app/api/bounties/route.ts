import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Bounty, { BountyStatus } from "@/lib/models/Bounty";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }
    const { title, description, skills, reward, deadline, contact } = await request.json();
    if (!description || !title || !skills || !reward || !deadline || !contact) {
      return NextResponse.json({ success: false, message: "All parameters are required" }, { status: 400 });
    }
    const newData = await Bounty.create({ title, description, skills, reward, deadline, contact, status: BountyStatus.PENDING, creator: session.userId });
    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest, {params}: {params: {search: string, sort: string, tags: string, page: string, size: string}}) {
  try {
    await dbConnect();

    const bounties = await Bounty.find({ status: BountyStatus.APPROVED }).sort({ createdAt: -1 }); // Sort by newest first
    return NextResponse.json({ success: true, bounties });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

