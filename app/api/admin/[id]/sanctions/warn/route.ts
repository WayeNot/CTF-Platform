import { sql } from "@/lib/db"
import { getUserIdBySessionId } from "@/lib/session";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {    
    const { id } = await params;
    const { reason } = await req.json();
    const cookieStore = await cookies()
    const session_id = cookieStore.get("session_id")?.value
    const staff_id = await getUserIdBySessionId(session_id)
    
    try {
        await sql`INSERT INTO sanctions (type, reason, duration, user_id, staff_id) VALUES ('warn', ${reason}, 0, ${id}, ${staff_id})`        
        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}