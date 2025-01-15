import { NextResponse } from 'next/server';

import { deleteSession, getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}


export async function DELETE() {
  try {
    await deleteSession()

    return NextResponse.json({ success: true });
  } catch (error) {

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
