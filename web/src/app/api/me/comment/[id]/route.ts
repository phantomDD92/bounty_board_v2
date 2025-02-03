import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Comment from '@/lib/models/Comment';
import { getSession } from '@/lib/session';
import { checkAuthenticated, checkOwner } from '@/utils/session';
import { Status } from '@/types/enumTypes';

// update comment status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: commentId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    if (!checkOwner(session, comment.creator.toString())) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const { text } = await request.json();

    await Comment.findByIdAndUpdate(commentId, { $set: { text, status: Status.PENDING, createdAt: new Date() } });

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

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    if (!checkOwner(session, comment.creator.toString())) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    await Comment.findByIdAndDelete(comment._id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
