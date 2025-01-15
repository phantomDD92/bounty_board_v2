import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Tag from '@/lib/models/Tag';
import { getSession } from '@/lib/session';
import { checkAdmin, checkAuthenticated } from '@/utils/session';

export async function GET() {
  await dbConnect(); // Connect to MongoDB

  try {
    const tags = await Tag.find({});

    return NextResponse.json({ success: true, tags });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const { _id, name } = await req.json();

    if (!_id || !name) {
      return NextResponse.json({ message: "ID, Name is required" }, { status: 400 });
    }

    const newTag = new Tag({ _id, name });

    await newTag.save();

    return NextResponse.json({ success: true, }, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
