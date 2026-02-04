import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get single job (public endpoint)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const job = await prisma.job.findUnique({
            where: { id, status: "active" },
            select: {
                id: true,
                title: true,
                description: true,
                whoWeAreLookingFor: true,
                howToApply: true,
                location: true,
                salary: true,
                type: true,
                createdAt: true,
            }
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch {
        return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
    }
}
