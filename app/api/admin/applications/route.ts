import { NextResponse } from "next/server";
import { prisma, ensureConnection } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";

// GET - List all applications
export async function GET() {
    await ensureConnection();
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const applications = await prisma.application.findMany({
            orderBy: { appliedAt: "desc" },
            include: {
                job: {
                    select: {
                        title: true,
                        location: true
                    }
                },
                comments: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        id: true,
                        comment: true,
                        fitmentTag: true,
                        adminEmail: true,
                        createdAt: true
                    }
                },
                _count: {
                    select: { comments: true }
                }
            }
        });
        return NextResponse.json(applications);
    } catch {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}
