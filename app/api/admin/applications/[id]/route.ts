import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";

// PUT - Update application status
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        const application = await prisma.application.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(application);
    } catch {
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}

// DELETE - Delete application
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.application.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
    }
}
