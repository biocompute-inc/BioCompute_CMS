import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Submit application (public endpoint)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { jobId, fullName, email, phone, linkedIn, resume, coverLetter } = body;

        if (!jobId || !fullName || !email || !phone || !linkedIn || !resume) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify job exists and is active
        const job = await prisma.job.findUnique({
            where: { id: jobId, status: "active" }
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found or no longer active" }, { status: 404 });
        }

        const application = await prisma.application.create({
            data: {
                jobId,
                fullName,
                email,
                phone,
                linkedIn,
                resume,
                coverLetter: coverLetter || null,
            },
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }
}
