import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    const body = await request.json();

    const res = await fetch(`${BASE_URL}/rooms/${params.roomId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data);
}