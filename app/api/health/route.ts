import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ status: "Vercel is working", time: new Date().toISOString() });
}