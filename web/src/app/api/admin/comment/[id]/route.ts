import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import { getSession } from '@/lib/session';
import Comment from '@/lib/models/Comment';
import BountyHistory from '@/lib/models/BountyHistory';

import { checkAdmin, checkAuthenticated } from '@/utils/session';
import { Status } from '@/types/enumTypes';

// update comment status
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: commentId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const { feedback, status } = await request.json();

    if (status != Status.PENDING && status != Status.REJECTED && status != Status.OPEN) {
      return NextResponse.json({ success: false, message: "Status is invalid" }, { status: 400 })
    }

    const comment = await Comment.findByIdAndUpdate(commentId, { $set: { status: status, feedback } });

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    if (status == Status.OPEN) {
      await BountyHistory.create({ creator: comment.creator, text: `sent a comment to the bounty`, bounty: comment.bounty });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: commentId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    await Comment.findByIdAndDelete(comment._id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
