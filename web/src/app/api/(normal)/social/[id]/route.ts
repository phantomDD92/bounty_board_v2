import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Social from '@/lib/models/Social';
import { getSession } from "@/lib/session";
import { checkAuthenticated } from "@/utils/session";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const socialId = params.id;
    const { title, url } = await request.json();

    if (!title || !url) {
      return NextResponse.json({ success: false, message: "Title, URL is required" }, { status: 400 });
    }

    const updatedSocial = await Social.findByIdAndUpdate(socialId, { $set: { title, url } }, { new: true });

    if (!updatedSocial) {
      return NextResponse.json({ success: false, message: "Social not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    // if (session.role == Role.USER) {

    //   return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 });
    // }

    await dbConnect();
    const socialId = params.id;
    const deletedSocial = await Social.findByIdAndDelete(socialId);

    if (!deletedSocial) {

      return NextResponse.json({ success: false, message: "Social not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
