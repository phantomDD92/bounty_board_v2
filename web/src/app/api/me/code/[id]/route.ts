import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from '@/lib/session';

import { checkAuthenticated, checkOwner } from '@/utils/session';

// delete code for current user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const code = await Code.findById(bountyId);

    if (!code) {
      return NextResponse.json({ success: false, message: "Bounty not found" }, { status: 404 });
    }

    if (!checkOwner(session, code.creator.toString())) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    await Code.findByIdAndDelete(code._id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
