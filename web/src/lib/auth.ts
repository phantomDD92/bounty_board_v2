import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)


export async function signToken(payload:JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
};

export async function verifyToken(token: string):Promise<JWTPayload | undefined> {
  try {
    const payload = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload.payload
  } catch (error) {

    return undefined
  }
};
