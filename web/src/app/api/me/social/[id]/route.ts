import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Social from '@/lib/models/Social';
import { getSession } from '@/lib/session';

import { checkAuthenticated, checkOwner } from '@/utils/session';

// delete infra
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: socialId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const social = await Social.findById(socialId);

    if (!social) {
      return NextResponse.json({ success: false, message: "Social not found" }, { status: 404 });
    }

    if (!checkOwner(session, social.creator.toString())) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    await Social.findByIdAndDelete(social._id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
