import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";

// GET - List all applications
export async function GET() {
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
                }
            }
        });
        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}
