import { NextRequest, NextResponse } from 'next/server';
import {  verifyLoginRequest } from '@/lib/verus';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await verifyLoginRequest(data);
    return new Response(JSON.stringify(true), {
      status: 200, headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

