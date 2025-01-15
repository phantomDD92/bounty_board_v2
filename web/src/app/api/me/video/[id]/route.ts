import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Video from '@/lib/models/Video';
import { getSession } from '@/lib/session';

import { checkAuthenticated, checkOwner } from '@/utils/session';

// delete infra
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: videoId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return NextResponse.json({ success: false, error: "Bounty not found" }, { status: 404 });
    }

    if (!checkOwner(session, video.creator.toString())) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    await Video.findByIdAndDelete(video._id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
