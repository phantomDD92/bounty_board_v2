import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import Infra from '@/lib/models/Infra';
import { getSession } from '@/lib/session';
import { Role } from '@/lib/models/User';

/**
 * @swagger
 * /api/infra:
 *   get:
 *     summary: Get a list of all Infra objects
 *     description: Fetch a list of all Infra objects.
 *     tags:
 *      - Infra
 *     responses:
 *       200:
 *         description: A list of Infra objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The title of the Infra.
 *                   description:
 *                     type: string
 *                     description: The description of the Infra.
 *                   url:
 *                     type: string
 *                     description: The URL of the Infra.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The creation date of the Infra.
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
  await dbConnect();

  try {
    const infraList = await Infra.find({});


return NextResponse.json({ success: true, infra: infraList });
  } catch (error) {
    console.error('Error fetching infra list:', error);

return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/infra:
 *   post:
 *     summary: Create a new Infra object
 *     description: Create a new Infra with a title, description, and URL.
 *     tags:
 *      - Infra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the Infra.
 *                 example: "New Infrastructure"
 *               description:
 *                 type: string
 *                 description: The description of the Infra.
 *                 example: "A description of the infrastructure"
 *               url:
 *                 type: string
 *                 description: The URL related to the Infra.
 *                 example: "https://www.example.com"
 *     responses:
 *       200:
 *         description: Infra created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Infra created successfully"
 *                 infra:
 *                   type: object
 *                   properties:
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The creation date of the Infra.
 *                     title:
 *                       type: string
 *                       description: The title of the Infra.
 *                     description:
 *                       type: string
 *                       description: The description of the Infra.
 *                     url:
 *                       type: string
 *                       description: The URL of the Infra.
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
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !session.isAuth) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    if (session.role == Role.USER) {
      return NextResponse.json({ success: false, error: "Permission required" }, { status: 403 })
    }

    const { title, description, url } = await req.json();

    if (!title || !description || !url) {
      return NextResponse.json({ success: false, message: "Title, Description, and URL are required." }, { status: 400 });
    }

    const newInfra = new Infra({ title, description, url });

    await newInfra.save();

return NextResponse.json({ success: true, }, { status: 201 });
  } catch (error) {
    console.error('Error creating infra:', error);

return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
