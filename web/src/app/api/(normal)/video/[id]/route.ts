import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Video from '@/lib/models/Video';
import { getSession } from "@/lib/session";
import { checkAuthenticated } from "@/utils/session";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const videoId = params.id;
    const { title, url } = await request.json();

    if (!title || !url) {
      return NextResponse.json({ success: false, message: "Title, URL is required" }, { status: 400 });
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, { $set: { title, url } }, { new: true });

    if (!updatedVideo) {
      return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    // if (session.role == Role.USER) {

    //   return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 });
    // }

    await dbConnect();
    const videoId = params.id;
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {

      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
