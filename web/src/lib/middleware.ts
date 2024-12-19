// lib/middleware.js
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import User, { IUser } from './models/User';

export function withAuthorization(handler: (req: NextRequest, user: IUser) => any) {
  return async (req:NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 403 });
    }
    const {id: userId} = payload;
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: 'Unauthorized: Invalid user' }, { status: 403 });
    // Pass the user object to the handler
    return handler(req, user);
  };
}
