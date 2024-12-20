import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from "@/lib/session";
import { Role } from "@/lib/models/User";

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     await dbConnect();
//     const videoId = params.id;
//     const { url } = await request.json();

//     if (!url) {
//       return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 });
//     }

//     const updatedVideo = await Video.findByIdAndUpdate(videoId, { url }, { new: true });

//     if (!updatedVideo) {
//       return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updatedVideo });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }


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
