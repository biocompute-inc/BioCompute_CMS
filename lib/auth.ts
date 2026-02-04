import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcryptjs";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export interface AuthPayload extends JWTPayload {
    sub: string;
    email: string;
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string) {
    return await bcrypt.compare(plain, hashed);
}

export async function signJWT(payload: AuthPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h") // Token expires in 24 hours
        .sign(SECRET_KEY);
}

export async function verifyJWT(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as AuthPayload;
    } catch {
        return null;
    }
}