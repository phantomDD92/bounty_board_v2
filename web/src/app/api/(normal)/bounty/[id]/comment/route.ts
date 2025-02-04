import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Comment from '@/lib/models/Comment';
import Bounty from '@/lib/models/Bounty';
import { getSession } from '@/lib/session';
import { checkAuthenticated } from '@/utils/session';
import { Status } from '@/types/enumTypes';
import BountyHistory from '@/lib/models/BountyHistory';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const comments = await Comment
      .find({ bounty: bountyId, status: Status.OPEN })
      .populate('creator', 'name');

    return NextResponse.json({ success: true, comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getSession();

  if (!checkAuthenticated(session)) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
  }

  const { id: bountyId } = params;
  const { text } = await request.json();

  // Validate request
  if (!text || !bountyId) {
    return NextResponse.json(
      { success: false, message: 'Text, creator, and bountyId are required.' },
      { status: 400 }
    );
  }

  // Check if bounty exists

  const bounty = await Bounty.findById(bountyId);

  if (!bounty) {
    return NextResponse.json(
      { success: false, message: 'Bounty not found.' },
      { status: 404 }
    );
  }

  // Create the comment
  try {
    const newComment = await Comment.create({ text, creator: session?.userId, bounty: bountyId, status: Status.OPEN });

    await Bounty.findByIdAndUpdate(bountyId, { $push: { comments: newComment._id } })
    await BountyHistory.create({ creator: session?.userId, text: `sent a comment to the bounty`, bounty: bountyId });

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal error', error }, { status: 500 });
  }
}
