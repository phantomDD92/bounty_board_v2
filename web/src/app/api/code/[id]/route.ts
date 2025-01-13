import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from "@/lib/session";
import { Role } from "@/lib/models/User";

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    if (session.role != Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 });
    }

    await dbConnect();
    const codeId = params.id;
    const deletedVideo = await Code.findByIdAndDelete(codeId);

    if (!deletedVideo) {
      return NextResponse.json({ success: false, error: "Code not found" }, { status: 404 });
    }

    
return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
