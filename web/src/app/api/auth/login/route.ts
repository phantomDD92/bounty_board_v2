import { NextRequest, NextResponse } from 'next/server';
import { cancelLoginRequest, createLoginRequest, getLoginRequest } from '@/lib/verus';

export async function POST(req: NextRequest) {
  try {
    const data = await createLoginRequest();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const {challenge} = await req.json();
    await cancelLoginRequest(challenge);
    return NextResponse.json({ success: true});
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const {challenge} = await req.json();
    const data = await getLoginRequest(challenge);
    console.log(data);
    return NextResponse.json({ success: data != undefined });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

