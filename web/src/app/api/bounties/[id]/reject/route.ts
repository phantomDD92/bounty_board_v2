import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Bounty, { BountyStatus } from '@/lib/models/Bounty';
import { getSession } from '@/lib/session';
import { Role } from '@/lib/models/User';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;
  // Create the comment
  try {
    const session = await getSession();
    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }
    if (session.role != Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }
    const {feedback} = await request.json();
    const bounty = await Bounty.findByIdAndUpdate(bountyId, { $set: { status: BountyStatus.REJECTED, feedback } });
    if (!bounty) {
      return NextResponse.json({ success: false, error: "Bounty not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error }, { status: 500 });
  }
}
