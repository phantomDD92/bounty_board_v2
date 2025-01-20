import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Bounty from '@/lib/models/Bounty';

// update bounty status
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const bounty = await Bounty
      .findById(bountyId)
      .populate('creator', 'name')
      .populate('skills', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'creator',
          select: 'name'
        }
      });

    if (!bounty) {
      return NextResponse.json({ success: false, message: "Bounty not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, bounty }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
