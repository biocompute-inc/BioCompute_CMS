import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    // 1. Check if the user is accessing an admin route
    if (request.nextUrl.pathname.startsWith("/admin")) {

        // Exception: Allow access to the login page itself
        if (request.nextUrl.pathname === "/admin/login") {
            return NextResponse.next();
        }

        // 2. Get the token from cookies
        const token = request.cookies.get("admin_token")?.value;

        // 3. Verify token
        const payload = token ? await verifyJWT(token) : null;

        if (!payload) {
            // 4. Redirect to login if invalid
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

// Only run middleware on admin routes
export const config = {
    matcher: "/admin/:path*",
};