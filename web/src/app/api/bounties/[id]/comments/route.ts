import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Comment from '@/lib/models/Comment';
import Bounty from '@/lib/models/Bounty';

/**
 * @swagger
 * /api/bounties/{id}/comments:
 *   get:
 *     summary: Retrieve comments for a specific bounty
 *     description: Fetches all comments associated with a given bounty ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bounty
 *         schema:
 *           type: string
 *           example: "64c1e4b527f1d2cabf123457"
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64c1e4b527f1d2cabf123458"
 *                       text:
 *                         type: string
 *                         example: "This bounty is amazing!"
 *                       creator:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64c1e4b527f1d2cabc123456"
 *                           name:
 *                             type: string
 *                             example: "john_doe"
 *                       bounty:
 *                         type: string
 *                         example: "64c1e4b527f1d2cabf123457"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-12-17T12:00:00.000Z"
 *       404:
 *         description: No comments found for the bounty
 *       500:
 *         description: Server error
 */
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;
  
  try {
    const comments = await Comment.find({ bounty: bountyId }).populate('creator', 'name');
  
    if (!comments || comments.length === 0) {
      return NextResponse.json({ success: false, message: 'No comments found.' }, { status: 404 });
    }
  
    return NextResponse.json({ success: true, data: comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: bountyId } = params;
  const { text, creator } = await request.json();

  // Validate request
  if (!text || !creator || !bountyId) {
    return NextResponse.json(
      { success: false, message: 'Text, creator, and bountyId are required.' },
      { status: 400 }
    );
  }

  // Check if bounty exists

  const bounty = await Bounty.findById(bountyId);

  if (!bounty) {
    return NextResponse.json(
      { success: false, message: 'Bounty not found.' },
      { status: 404 }
    );
  }

  // Create the comment
  try {
    const newComment = await Comment.create({ text, creator, bounty: bountyId });

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error }, { status: 500 });
  }
}
