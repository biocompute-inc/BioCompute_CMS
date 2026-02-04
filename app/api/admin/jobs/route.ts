import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";

// GET - List all jobs
export async function GET() {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const jobs = await prisma.job.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });
        return NextResponse.json(jobs);
    } catch {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

// POST - Create new job
export async function POST(req: Request) {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, whoWeAreLookingFor, howToApply, location, salary, type, status } = body;

        if (!title || !description || !whoWeAreLookingFor || !howToApply || !location) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                whoWeAreLookingFor,
                howToApply,
                location,
                salary: salary || null,
                type: type || "full-time",
                status: status || "active",
            },
        });

        return NextResponse.json(job, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}
