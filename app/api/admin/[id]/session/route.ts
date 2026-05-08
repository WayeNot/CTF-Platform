import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const result = await sql`SELECT * FROM user_session WHERE user_id = ${id}`
        return Response.json({ success: true, data: result })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { session_id, is_active } = await req.json();
    try {
        await sql`UPDATE user_session SET is_active = ${!is_active} WHERE session_id = ${session_id} AND user_id = ${id}`;
        return Response.json({ success: true })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}