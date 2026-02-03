import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";

// PUT - Update job
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { title, description, whoWeAreLookingFor, howToApply, location, salary, status } = body;

        const job = await prisma.job.update({
            where: { id },
            data: {
                title,
                description,
                whoWeAreLookingFor,
                howToApply,
                location,
                salary,
                status,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }
}

// DELETE - Delete job
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.job.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
}
