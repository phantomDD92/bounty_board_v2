import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongoose';
import Video from '@/lib/models/Video';
import { getSession } from "@/lib/session";
import { Role } from "@/lib/models/User";
import VideoService from "@/lib/service.ts/VideoService";

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: Create a new video
 *     description: Adds a new video to the database.
 *     tags:
 *       - Videos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the video.
 *                 example: "https://example.com/video.mp4"
 *     responses:
 *       201:
 *         description: Video created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64c1e4b527f1d2cabc123456
 *                     url:
 *                       type: string
 *                       example: "https://example.com/video.mp4"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T12:00:00.000Z"
 *       400:
 *         description: Bad request. URL is required.
 *       500:
 *         description: Server error.
 */
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
    const { title, url } = await request.json();
    if (!url || !title) {
      return NextResponse.json({ success: false, message: "URL, Title is required" }, { status: 400 });
    }
    const newVideo = await VideoService.create({title, url})
    return NextResponse.json({ success: true, data: newVideo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get all videos
 *     description: Fetches a list of all videos from the database.
 *     tags:
 *       - Videos
 *     responses:
 *       200:
 *         description: A list of videos retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64c1e4b527f1d2cabc123456
 *                   url:
 *                     type: string
 *                     description: The URL of the video.
 *                     example: "https://example.com/video.mp4"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the video was created.
 *                     example: "2023-01-01T12:00:00.000Z"
 *       500:
 *         description: Server error.
 */
export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find().sort({ createdAt: -1 }); // Sort by newest first
    return NextResponse.json({ success: true, videos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

