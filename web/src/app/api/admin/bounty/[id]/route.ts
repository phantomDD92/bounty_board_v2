import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Bounty from '@/lib/models/Bounty';
import { getSession } from '@/lib/session';
import { checkAdmin, checkAuthenticated } from '@/utils/session';
import { PublishStatus } from '@/types/enumTypes';

// update bounty status
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const { feedback, approve } = await request.json();
    const bounty = await Bounty.findByIdAndUpdate(bountyId, { $set: { status: approve ? PublishStatus.APPROVED : PublishStatus.REJECTED, feedback } });

    if (!bounty) {
      return NextResponse.json({ success: false, message: "Bounty not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
