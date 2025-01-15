import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Comment from '@/lib/models/Comment';
import Bounty from '@/lib/models/Bounty';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const comments = await Comment.find({ bounty: bountyId }).populate('creator', 'name');

    if (!comments || comments.length === 0) {
      return NextResponse.json({ success: false, message: 'No comments found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;
  const { text, creator } = await request.json();

  // Validate request
  if (!text || !creator || !bountyId) {
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
    const newComment = await Comment.create({ text, creator, bounty: bountyId });

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error }, { status: 500 });
  }
}
