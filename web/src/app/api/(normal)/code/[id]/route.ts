import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from "@/lib/session";
import { checkAdmin, checkAuthenticated } from "@/utils/session";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const codeId = params.id;
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Title, Description are required" }, { status: 400 });
    }

    const updatedCode = await Code.findByIdAndUpdate(codeId, { $set: { title, description } }, { new: true });

    if (!updatedCode) {
      return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCode });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 });
    }

    await dbConnect();
    const codeId = params.id;
    const deletedVideo = await Code.findByIdAndDelete(codeId);

    if (!deletedVideo) {
      return NextResponse.json({ success: false, message: "Code not found" }, { status: 404 });
    }


return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
