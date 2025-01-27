import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from '@/lib/session';

import { checkAdmin, checkAuthenticated } from '@/utils/session';

import { PublishStatus } from '@/types/enumTypes';

// update code status
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: codeId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const { feedback, status } = await request.json();

    if (status < PublishStatus.PENDING || status > PublishStatus.REJECTED) {
      return NextResponse.json({ success: false, message: "Status is invalid" }, { status: 400 })
    }

    const infra = await Code.findByIdAndUpdate(codeId, { $set: { status, feedback } });

    if (!infra) {
      return NextResponse.json({ success: false, message: "Infra not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}

// update code weight
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: codeId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const { weight } = await request.json();

    const bounty = await Code.findByIdAndUpdate(codeId, { $set: { weight } });

    if (!bounty) {
      return NextResponse.json({ success: false, message: "Code not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}

// change code content
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: codeId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const { title, description, snippets } = await request.json();

    const bounty = await Code.findByIdAndUpdate(codeId, { $set: { title, description, snippets } });

    if (!bounty) {
      return NextResponse.json({ success: false, message: "Code not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const code = await Code.findById(bountyId);

    if (!code) {
      return NextResponse.json({ success: false, message: "Bounty not found" }, { status: 404 });
    }

    await Code.findByIdAndDelete(code._id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
