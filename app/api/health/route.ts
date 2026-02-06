import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "healthy",
        service: "BioCompute Admin Portal",
        timestamp: new Date().toISOString()
    });
}