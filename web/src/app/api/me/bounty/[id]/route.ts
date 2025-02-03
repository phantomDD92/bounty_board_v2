import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Bounty from '@/lib/models/Bounty';
import { getSession } from '@/lib/session';
import { checkAuthenticated, checkOwner } from '@/utils/session';
import BountyHistory from '@/lib/models/BountyHistory';
import User from '@/lib/models/User';
import { Status } from '@/types/enumTypes';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const { title, description, skills, reward, deadline, phone, email } = await request.json();

    const bounty = await Bounty.findById(bountyId);

    if (!bounty) {
      return NextResponse.json({ success: false, message: "Bounty not found" }, { status: 404 });
    }

    if (!checkOwner(session, bounty.creator.toString())) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const fields = [];
    if (description != bounty.description)
      fields.push("description")
    if (reward != bounty.reward)
      fields.push("reward")
    if (deadline != bounty.deadline)
      fields.push("deadline")

    await Bounty.findByIdAndUpdate(bountyId, { $set: { title, description, skills, reward, deadline, phone, email, status: Status.PENDING } });

    if (fields.length > 0) {
      await BountyHistory.create({ creator: session?.userId, text: `changed the bounty's ${fields.join(', ')} by owner(${session?.name})`, bounty: bounty._id })
    } else {
      await BountyHistory.create({ creator: session?.userId, text: `changed the bounty by owner(${session?.name})`, bounty: bounty._id })
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}

// assign the task
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const bounty = await Bounty.findById(bountyId);

    if (!bounty) {
      return NextResponse.json({ success: false, message: "Bounty not found" }, { status: 404 });
    }

    if (!checkOwner(session, bounty.creator.toString())) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const { assignee } = await request.json();

    const user = await User.findById(assignee);

    if (!user) {
      return NextResponse.json({ success: false, message: "Assignee not found" }, { status: 404 });
    }

    await Bounty.findByIdAndUpdate(bountyId, { $set: { assignee, status: Status.ASSIGNED } });

    await BountyHistory.create({ creator: session?.userId, text: `assigned the bounty to ${user.name}`, bounty: bounty._id })

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}

// complete the bounty
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const bounty = await Bounty.findById(bountyId);

    if (!bounty) {
      return NextResponse.json({ success: false, message: "Bounty not found" }, { status: 404 });
    }

    if (!checkOwner(session, bounty.creator.toString())) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    await Bounty.findByIdAndUpdate(bountyId, { $set: { status: Status.COMPLETED } });

    await BountyHistory.create({ creator: session?.userId, text: `completed the bounty by owner(${session?.name})`, bounty: bounty._id })

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}

// delete bounty for current user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const bounty = await Bounty.findById(bountyId);

    if (!bounty) {
      return NextResponse.json({ success: false, message: "Bounty not found" }, { status: 404 });
    }

    if (!checkOwner(session, bounty.creator.toString())) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    await Bounty.findByIdAndDelete(bounty._id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error }, { status: 500 });
  }
}
