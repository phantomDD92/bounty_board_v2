import {  NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import dbConnect from '@/lib/mongoose';
import { getSession } from "@/lib/session";
import Bounty from "@/lib/models/Bounty";
import User from "@/lib/models/User";
import { checkAuthenticated, checkRateLimited } from "@/utils/session";
import { Status } from "@/types/enumTypes";

// create bountynpm
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

    const newData = await Bounty.create({ title, description, skills, reward, deadline, phone, email, status: Status.PENDING, creator: session?.userId });

    await User.findByIdAndUpdate(session?.userId, { $set: { submittedAt: new Date() } })

    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {

    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// get bounty list
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    await dbConnect();

    let tags: string[] = [];
    let bounties = [];

    if (searchParams.get('tags') != "") {
      tags = searchParams.get('tags')?.split(",") || []
    }

    const search = searchParams.get("search")

    if (tags.length > 0) {
      bounties = await Bounty
        .find({
          status: Status.OPEN,
          skills: { $in: tags },
          $or: [
            { title: { $regex: search, $options: 'i' } },  // 'i' for case-insensitive
            { description: { $regex: search, $options: 'i' } }
          ]
        })
        .populate("creator", "name")
        .populate("skills")
        .sort(searchParams.get('sort') || '-createdAt')
    } else {
      bounties = await Bounty
        .find({
          status: Status.OPEN,
          $or: [
            { title: { $regex: search, $options: 'i' } },  // 'i' for case-insensitive
            { description: { $regex: search, $options: 'i' } }
          ]
        })
        .populate("creator", "name")
        .populate("skills")
        .sort(searchParams.get('sort') || '-createdAt')
    }

    // .skip((parseInt(page) - 1) * parseInt(size))
    // .limit(parseInt(size)); // Sort by newest first

    return NextResponse.json({ success: true, bounties });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

