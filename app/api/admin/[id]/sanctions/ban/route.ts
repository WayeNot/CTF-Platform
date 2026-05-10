import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db"
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { reason, duration } = await req.json();
        const cookieStore = await cookies()
        const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

        if (!await hasPermission(Permissions.advanced.administrator, user_id) && !await hasPermission(Permissions.panelAdmin.user.sanctions, user_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        if (duration === 0) {
            await sql`INSERT INTO sanctions (type, reason, duration, user_id, staff_id, permanent) VALUES ('ban', ${reason}, 0, ${id}, ${user_id}, TRUE)`
            await sql`UPDATE users SET is_disabled = TRUE WHERE user_id = ${id}`
        } else {
            const expiresAt = new Date(Date.now() + duration * 60 * 1000);
            await sql`INSERT INTO sanctions (type, reason, duration, user_id, staff_id, expires_at) VALUES ('ban', ${reason}, ${duration}, ${id}, ${user_id}, ${expiresAt})`
        }
        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}