import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await sql`UPDATE user_session SET is_active = FALSE WHERE user_id = ${id}`;
        return Response.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}