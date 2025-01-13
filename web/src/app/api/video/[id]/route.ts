import { NextResponse } from "next/server";

import dbConnect from '@/lib/mongoose';
import Video from '@/lib/models/Video';
import { getSession } from "@/lib/session";
import { Role } from "@/lib/models/User";

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: Update a video
 *     description: Updates the details of an existing video by ID.
 *     tags:
 *       - Videos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the video to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The new URL of the video.
 *                 example: "https://example.com/new-video.mp4"
 *     responses:
 *       200:
 *         description: Video updated successfully.
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
 *                       example: "https://example.com/new-video.mp4"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T12:00:00.000Z"
 *       400:
 *         description: Bad request. URL is required.
 *       404:
 *         description: Video not found.
 *       500:
 *         description: Server error.
 */
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


/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: Delete a video
 *     description: Removes a video from the database by its ID.
 *     tags:
 *       - Videos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the video to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Video deleted successfully."
 *       404:
 *         description: Video not found.
 *       500:
 *         description: Server error.
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();

    if (!session || !session.isAuth) {

      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    if (session.role == Role.USER) {

      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 });
    }

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
