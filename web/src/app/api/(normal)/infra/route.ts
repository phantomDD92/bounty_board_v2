import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Infra from '@/lib/models/Infra';
import { getSession } from '@/lib/session';
import User from '@/lib/models/User';

import { checkAuthenticated, checkRateLimited } from '@/utils/session';

import { PublishStatus } from '@/types/enumTypes';

export async function GET() {
  await dbConnect();

  try {
    const infraList = await Infra.find({ status: PublishStatus.APPROVED }).populate('creator', 'name').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, infra: infraList });
  } catch (error) {
    console.error('Error fetching infra list:', error);

    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkRateLimited(session)) {
      return NextResponse.json({ success: false, message: "Submission rate limited" }, { status: 403 })
    }

    const { title, description, url } = await req.json();

    if (!title || !description || !url) {
      return NextResponse.json({ success: false, message: "Title, Description, and URL are required." }, { status: 400 });
    }

    const newInfra = new Infra({ title, description, url, creator: session.userId });

    await User.findByIdAndUpdate(session.userId, { $set: { submittedAt: new Date() } })

    await newInfra.save();

    return NextResponse.json({ success: true, }, { status: 201 });
  } catch (error) {
    console.error('Error creating infra:', error);

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
