import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Infra from '@/lib/models/Infra';
import { getSession } from '@/lib/session';

import { checkAuthenticated, checkOwner } from '@/utils/session';

// delete infra
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const infra = await Infra.findById(bountyId);

    if (!infra) {
      return NextResponse.json({ success: false, error: "Bounty not found" }, { status: 404 });
    }

    if (!checkOwner(session, infra.creator.toString())) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    await Infra.findByIdAndDelete(infra._id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
