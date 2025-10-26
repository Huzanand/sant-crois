import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function GET(
    request: NextRequest,
    { params }: { params: { roomId: string } }
) {
    const { roomId } = params;

    try {
        const res = await fetch(`${BASE_URL}/rooms/${roomId}`, {
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            console.error("Failed to fetch from backend:", res.statusText);
            return NextResponse.json({ error: "Failed to fetch room" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("Get room request error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}