import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Tag from '@/lib/models/Tag';

export async function GET() {
  await dbConnect(); // Connect to MongoDB

  try {
    const tags = await Tag.find({});

    return NextResponse.json({ success: true, tags });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error occurred' },
      { status: 500 }
    );
  }
}
