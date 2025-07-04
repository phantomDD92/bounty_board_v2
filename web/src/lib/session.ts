import 'server-only'

import type { NextResponse } from 'next/server'

import { cookies } from 'next/headers'

import { SignJWT, jwtVerify } from 'jose'

import { getUserById } from '@/lib/service/UserService'
import type { IUser } from '@/lib/models/User'

import type { SessionType } from '@/types/valueTypes'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

type SessionPayload = {
  id: string,
  name: string,
  iaddress: string,
  role: number,
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = ''): Promise<any> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })

    return payload
  } catch (error) {

  }
}

export async function createSession(res: NextResponse, user: IUser) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const session = await encrypt({
    id: user._id,
    name: user.name,
    role: user.role,
    iaddress: user.iaddress
  })

  res.cookies.set('session', session, {
    httpOnly: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function updateSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const cookieStore = cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()

  cookieStore.delete('session')
}

export async function getSession(): Promise<SessionType | undefined> {
  const cookie = (await cookies()).get('session')?.value

  const session = await decrypt(cookie)

  if (!session || !session?.id) {

    return undefined
  }

  const userId: string = session.id;

  const user = await getUserById(userId)

  if (!user)
    return undefined;

  return {
    isAuth: true,
    userId: user._id,
    name: user.name,
    role: user.role,
    iaddress: user.iaddress,
    submittedAt: user.submittedAt
  }
}

