import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Video from '@/lib/models/Infra';
import { getSession } from '@/lib/session';

import { checkAdmin, checkAuthenticated } from '@/utils/session';

import { PublishStatus } from '@/types/enumTypes';

// update video status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: videoId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const { feedback, approved } = await request.json();
    const video = await Video.findByIdAndUpdate(videoId, { $set: { status: approved ? PublishStatus.APPROVED : PublishStatus.REJECTED, feedback } });

    if (!video) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
