import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     tags:
 *      - Hello
 *     responses:
 *       200:
 *         description: hello world
 */
export async function GET(req: Request) {
  return NextResponse.json(
    {
      message: 'hello world',
    },
    {
      status: 200,
    }
  );
}
