import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import BountyHistory from '@/lib/models/BountyHistory';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const history = await BountyHistory.find({ bounty: bountyId }).populate('creator', 'name');

    return NextResponse.json({ success: true, history }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
