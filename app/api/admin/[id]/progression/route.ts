import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { error } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies()
        const staff_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

        if (!await hasPermission(Permissions.advanced.administrator, staff_id) && !await hasPermission(Permissions.panelAdmin.user.sanctions, staff_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const r1 = await sql`SELECT title, difficulty, category FROM challenges`
        const r2 = await sql`SELECT COUNT(challenge_id) FROM flag_find WHERE user_id = ${id} GROUP BY challenge_id`
        const r3 = await sql`SELECT COUNT(challenge_id) FROM flags GROUP BY challenge_id`

        //const infoFlags = new Set(r1.map((f: any) => f.flag_id));
        //const foundFlags = new Set(r2.map((h: any) => h.flag_id));
        //const countFlags = flags.map((flag: any) => ({ ...flag, found: infoFlags.has(flag.id), hint_show: countFlags.has(flag.id) }));
        
        return Response.json({ success: true })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}