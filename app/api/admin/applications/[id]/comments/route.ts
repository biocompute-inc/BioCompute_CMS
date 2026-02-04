import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";

// GET - Get all comments for an application
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const comments = await prisma.applicationComment.findMany({
            where: { applicationId: id },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

// POST - Add a comment to an application
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { comment, fitmentTag } = body;

        if (!comment || comment.trim() === "") {
            return NextResponse.json({ error: "Comment is required" }, { status: 400 });
        }

        const newComment = await prisma.applicationComment.create({
            data: {
                applicationId: id,
                adminEmail: auth.email,
                comment: comment.trim(),
                fitmentTag: fitmentTag || null,
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
