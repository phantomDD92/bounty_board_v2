import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import moment from 'moment';

import dbConnect from '@/lib/mongoose';
import Infra from '@/lib/models/Infra';
import { getSession } from '@/lib/session';
import User from '@/lib/models/User';
import systemConfig from '@/configs/systemConfig';

export async function GET() {
  await dbConnect();

  try {
    const infraList = await Infra.find({});

    return NextResponse.json({ success: true, infra: infraList });
  } catch (error) {
    console.error('Error fetching infra list:', error);

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.submittedAt && moment().diff(session.submittedAt, "minute") >= systemConfig.submissionInterval) {
      return NextResponse.json({ success: false, error: "Submission rate limited" }, { status: 403 })
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
