import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import { getSession } from '@/lib/session';
import Comment from '@/lib/models/Comment';

import { checkAuthenticated } from '@/utils/session';
import { Status } from '@/types/enumTypes';

// report comment
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: commentId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const comment = await Comment.findByIdAndUpdate(commentId, { $set: { status: Status.PENDING } });

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
