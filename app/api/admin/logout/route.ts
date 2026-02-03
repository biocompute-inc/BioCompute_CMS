import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware";

export async function POST(req: Request) {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    // Clear the admin token cookie
    response.cookies.set("admin_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0, // Expire immediately
        path: "/",
    });

    return response;
}
