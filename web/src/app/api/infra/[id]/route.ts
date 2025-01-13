import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Infra from '@/lib/models/Infra';
import { getSession } from '@/lib/session';
import { Role } from '@/lib/models/User';


/**
 * @swagger
 * /api/infra/{id}:
 *   put:
 *     summary: Update an Infra object by ID
 *     description: Update the Infra by its custom string ID.
 *     tags:
 *      - Infra
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Infra object to update.
 *         schema:
 *           type: string
 *           example: "custom-infra-id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the Infra.
 *                 example: "Updated Infra"
 *               description:
 *                 type: string
 *                 description: The new description of the Infra.
 *                 example: "Updated description of the Infra"
 *               url:
 *                 type: string
 *                 description: The new URL for the Infra.
 *                 example: "https://updated-url.com"
 *     responses:
 *       200:
 *         description: Infra updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Infra updated successfully"
 *                 infra:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: The updated title of the Infra.
 *                     description:
 *                       type: string
 *                       description: The updated description of the Infra.
 *                     url:
 *                       type: string
 *                       description: The updated URL of the Infra.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The creation date of the Infra.
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Title, Description, and URL are required."
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
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.role == Role.USER) {
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

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.role == Role.USER) {
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
