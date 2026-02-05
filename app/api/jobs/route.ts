import { NextResponse } from "next/server";
import { prisma, ensureConnection } from "@/lib/prisma";

// GET - List active jobs (public endpoint)
export async function GET() {
    await ensureConnection();
    try {

        const jobs = await prisma.job.findMany({
            where: { status: "active" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                salary: true,
                type: true,
                createdAt: true,
            }
        });
        return NextResponse.json(jobs);
    } catch (e) {
        return NextResponse.json({ error: `Failed to fetch jobs: ${e}` }, { status: 500 });
    }
}
