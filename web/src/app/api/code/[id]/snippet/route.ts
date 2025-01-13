import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Code from '@/lib/models/Code';
import { getSession } from "@/lib/session";
import { Role } from "@/lib/models/User";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.role != Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const { language, code } = await request.json();

    if (!language || !code) {
      return NextResponse.json({ success: false, message: "Language, Code is required" }, { status: 400 });
    }

    await dbConnect();
    const codeId = params.id;

    await Code.findByIdAndUpdate(codeId, { $push: { snippets: { language, code } } });
    
return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
