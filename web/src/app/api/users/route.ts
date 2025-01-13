import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Fetches a list of all users from the database.
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 609e125c8491f47b0c8a1234
 *                   iaddress:
 *                     type: string
 *                     description: The address of the user.
 *                     example: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV"
 *                   name:
 *                     type: string
 *                     description: The name of the user.
 *                     example: "BBB.bitcoin@"
 *       500:
 *         description: Server error
 */

export async function GET() {
  await dbConnect(); // Connect to MongoDB
  const users = await User.find({});

  
return NextResponse.json(users);
}

