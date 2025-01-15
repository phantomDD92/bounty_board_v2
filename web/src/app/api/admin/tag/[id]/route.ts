import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongoose";
import Tag from "@/lib/models/Tag";
import { getSession } from "@/lib/session";
import { checkAdmin, checkAuthenticated } from "@/utils/session";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const tagId = params.id;
    const { name } = await request.json();
    const updatedTag = await Tag.findByIdAndUpdate(tagId, { $set: { name } }, { new: true, });

    if (!updatedTag) {
      return NextResponse.json({ success: false, message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTag });
  } catch (error: any) {
    // console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, message: "Permission required" }, { status: 403 })
    }

    const tagId = params.id;
    const deletedTag = await Tag.findByIdAndDelete(tagId);

    if (!deletedTag) {
      return NextResponse.json({ success: false, message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
