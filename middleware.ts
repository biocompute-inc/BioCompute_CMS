import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting store (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string, path: string): string {
    return `${ip}:${path}`;
}

function checkRateLimit(ip: string, path: string, maxRequests: number, windowMs: number): boolean {
    const key = getRateLimitKey(ip, path);
    const now = Date.now();
    const record = rateLimit.get(key);

    if (!record || now > record.resetTime) {
        rateLimit.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxRequests) {
        return false;
    }

    record.count++;
    return true;
}

export function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const path = request.nextUrl.pathname;

    // Rate limiting for API routes
    if (path.startsWith("/api/")) {
        // Strict rate limit for authentication endpoints
        if (path.startsWith("/api/admin/login")) {
            if (!checkRateLimit(ip, path, 5, 15 * 60 * 1000)) { // 5 requests per 15 minutes
                return NextResponse.json(
                    { error: "Too many login attempts. Please try again later." },
                    { status: 429 }
                );
            }
        }
        // Rate limit for application submissions
        else if (path.startsWith("/api/applications")) {
            if (!checkRateLimit(ip, path, 10, 60 * 60 * 1000)) { // 10 requests per hour
                return NextResponse.json(
                    { error: "Too many application submissions. Please try again later." },
                    { status: 429 }
                );
            }
        }
        // General API rate limit
        else {
            if (!checkRateLimit(ip, path, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
                return NextResponse.json(
                    { error: "Too many requests. Please try again later." },
                    { status: 429 }
                );
            }
        }
    }

    // Protect admin routes
    if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // Add security headers
    const response = NextResponse.next();

    // CSRF protection via SameSite cookies (already set in login)
    // Additional security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
}

export const config = {
    matcher: [
        "/api/:path*",
        "/admin/:path*",
    ],
};
