import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Tag from '@/lib/models/Tag';

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     description: Retrieve a list of all tags with their IDs and names.
 *     tags:
 *      - Tags
 *     responses:
 *       200:
 *         description: A list of tags retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the tag.
 *                     example: "Development"
 *                   name:
 *                     type: string
 *                     description: The name of the tag.
 *                     example: "💻 Development"
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
 *
 *   post:
 *     summary: Create a new tag
 *     description: Create a new tag with a custom string ID and a name.
 *     tags:
 *      - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID for the tag.
 *                 example: "development"
 *               name:
 *                 type: string
 *                 description: The name of the tag.
 *                 example: "💻 Development"
 *     responses:
 *       200:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag created successfully"
 *                 tag:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The custom ID of the created tag.
 *                       example: "development"
 *                     name:
 *                       type: string
 *                       description: The name of the tag.
 *                       example: "💻 Development"
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID (_id) is required"
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

export async function GET() {
  await dbConnect(); // Connect to MongoDB
  try {
    const tags = await Tag.find({});
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { message: 'Server error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { _id, name } = await req.json();

    if (!_id) {
      return NextResponse.json({ message: "ID (_id) is required" }, { status: 400 });
    }

    const newTag = new Tag({ _id, name });
    await newTag.save();

    return NextResponse.json({ message: "Tag created successfully", tag: newTag });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { message: 'Server error occurred' },
      { status: 500 }
    );
  }
}
