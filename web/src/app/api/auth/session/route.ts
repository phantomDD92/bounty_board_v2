import { NextRequest, NextResponse } from 'next/server';
import { deleteSession, getSession } from '@/lib/session';

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Get user session
 *     description: Retrieves the current user session if authenticated. Returns an error if the session is invalid or not found.
 *     tags:
 *       - Auth
 *     security:
 *       - sessionCookie: []
 *     responses:
 *       200:
 *         description: Retrieve the session information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 session:
 *                   type: object
 *                   description: The session details of the authenticated user.
 *                   properties:
 *                     isAuth:
 *                       type: boolean
 *                       description: The user’s unique identifier.
 *                       example: true
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                       example: "user@example.com"
 *       401:
 *         description: Unauthorized. The session is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: session
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      // User is not authenticated
      return NextResponse.json({message: "Unauthorized"}, { status: 401 });
    }
    return NextResponse.json({ message: 'Success', session });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    await deleteSession()
    return NextResponse.json({ message: 'Success'});
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
