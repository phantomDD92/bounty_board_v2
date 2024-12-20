import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from "@/lib/session";
import { Role } from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.isAuth) {
      return NextResponse.json({success: false, error: "Authentication required"}, {status: 401})
    }
    if (session.role != Role.ADMIN) {
      return NextResponse.json({success: false, error: "Permission required"}, {status: 403})
    }
    await dbConnect();
    const { title, description, snippets } = await request.json();
    if (!description || !title) {
      return NextResponse.json({ success: false, message: "URL, Description is required" }, { status: 400 });
    }
    const newData = await Code.create({title, description, snippets})
    return NextResponse.json({ success: true, data: newData }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const codes = await Code.find().sort({ createdAt: -1 }); // Sort by newest first
    return NextResponse.json({ success: true, codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

