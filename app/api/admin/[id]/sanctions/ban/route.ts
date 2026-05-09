import { sql } from "@/lib/db"
import { getUserIdBySessionId } from "@/lib/session";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { reason, duration } = await req.json();
    const cookieStore = await cookies()
    const session_id = cookieStore.get("session_id")?.value
    const staff_id = await getUserIdBySessionId(session_id)

    try {
        if (duration === 0) {
            await sql`INSERT INTO sanctions (type, reason, duration, user_id, staff_id, permanent) VALUES ('ban', ${reason}, 0, ${id}, ${staff_id}, TRUE)`
            await sql`UPDATE users SET is_disabled = TRUE WHERE user_id = ${id}`
        } else {
            const expiresAt = new Date(Date.now() + duration * 60 * 1000);
            await sql`INSERT INTO sanctions (type, reason, duration, user_id, staff_id, expires_at) VALUES ('ban', ${reason}, ${duration}, ${id}, ${staff_id}, ${expiresAt})`
        }
        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}