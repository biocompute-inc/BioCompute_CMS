import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signJWT } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // 1. Find Admin
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 2. Verify Password
        const isValid = await comparePassword(password, admin.password_hash);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 3. Generate JWT
        const token = await signJWT({ sub: admin.id, email: admin.email });

        // 4. Create the Response
        const response = NextResponse.json({ success: true });

        // 5. Set HttpOnly Cookie
        response.cookies.set("admin_token", token, {
            httpOnly: true, // JavaScript cannot read this (prevents XSS)
            secure: process.env.NODE_ENV === "production", // HTTPS only in prod
            sameSite: "strict", // CSRF protection
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;

    } catch {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}