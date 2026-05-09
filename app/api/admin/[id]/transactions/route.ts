import { sql } from "@/lib/db"
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const result = await sql`SELECT * FROM transactions WHERE user_id = ${id} ORDER BY id DESC`
        return Response.json({ success: true, data: result })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}