import { NextResponse } from "next/server";
import { prisma, ensureConnection } from "@/lib/prisma";
import { comparePassword, signJWT } from "@/lib/auth";

export async function POST(req: Request) {
    await ensureConnection();
    try {
        const { email, password } = await req.json();
        console.log("🔍 Login Attempt for:", email);

        // 1. Find Admin
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        // DEBUG 1: Did we find the user?
        if (!admin) {
            console.log("❌ Error: Admin user NOT FOUND in DB.");
            return NextResponse.json({ error: "Invalid credentials (User)" }, { status: 401 });
        }
        console.log("✅ Admin found. ID:", admin.id);

        // DEBUG 2: Check the hash
        // We log the first 10 chars to verify it's loaded and looks like a hash ($2b$...)
        console.log("🔍 Hash from DB:", admin.password_hash ? admin.password_hash.substring(0, 10) + "..." : "UNDEFINED");

        // 2. Verify Password
        const isValid = await comparePassword(password, admin.password_hash);
        console.log("🔍 Password Match Result:", isValid);

        if (!isValid) {
            console.log("❌ Error: Password mismatch.");
            return NextResponse.json({ error: "Invalid credentials (Password)" }, { status: 401 });
        }

        // 3. Generate JWT
        const token = await signJWT({ sub: admin.id, email: admin.email });
        console.log("✅ Token generated successfully");

        const response = NextResponse.json({ success: true });
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;

    } catch (e) {
        console.error("🔥 CRITICAL ERROR:", e);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}