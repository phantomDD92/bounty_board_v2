import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongoose";
import Tag from "@/lib/models/Tag";
import { getSession } from "@/lib/session";
import { Role } from "@/lib/models/User";

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Update a tag
 *     description: Update a tag by its custom string ID.
 *     tags:
 *      - Tags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The string ID of the tag to update.
 *         schema:
 *           type: string
 *           example: "development"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the tag.
 *                 example: "💻 Development"
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag updated successfully"
 *                 tag:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the updated tag.
 *                       example: "development"
 *                     name:
 *                       type: string
 *                       description: The updated name of the tag.
 *                       example: "💻 Development"
 *       400:
 *         description: Bad request - Invalid ID or missing name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID (_id) is required or invalid"
 *       404:
 *         description: Tag not found - Invalid tag ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error occurred"
 */

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.role == Role.USER) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Delete a tag by ID
 *     description: Delete a tag from the database by its ID.
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the tag to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The tag was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Tag not found.
 *       500:
 *         description: Server error.
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.role == Role.USER) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const tagId = params.id;
    const deletedTag = await Tag.findByIdAndDelete(tagId);

    if (!deletedTag) {
      return NextResponse.json({ success: false, message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
