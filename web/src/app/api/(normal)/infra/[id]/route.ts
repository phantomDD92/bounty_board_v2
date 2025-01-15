import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Infra from '@/lib/models/Infra';
import { getSession } from '@/lib/session';

import { checkAdmin, checkAuthenticated } from '@/utils/session';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const { id } = params;
    const { title, description, url } = await req.json();

    if (!title || !description || !url) {
      return NextResponse.json({ success: false, error: "Title, Description, and URL are required." }, { status: 400 });
    }

    const updatedInfra = await Infra.findByIdAndUpdate(id, { $set: { title, description, url } }, { new: true });

    if (!updatedInfra) {
      return NextResponse.json({ success: false, error: "Infra not found" }, { status: 404 });
    }


return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating infra:', error);

return NextResponse.json({ success: false, error: "Server error occurred" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/infra/{id}:
 *   delete:
 *     summary: Delete an Infra object by ID
 *     description: Delete the Infra object by its custom string ID.
 *     tags:
 *      - Infra
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Infra object to delete.
 *         schema:
 *           type: string
 *           example: "custom-infra-id"
 *     responses:
 *       200:
 *         description: Infra deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Infra deleted successfully"
 *       404:
 *         description: Infra not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Infra not found"
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
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const session = await getSession();

    if (!checkAuthenticated(session)) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (!checkAdmin(session)) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const { id } = params;
    const deletedInfra = await Infra.findByIdAndDelete(id);

    if (!deletedInfra) {
      return NextResponse.json({ success: false, error: "Infra not found" }, { status: 404 });
    }


return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting infra:', error);

return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
