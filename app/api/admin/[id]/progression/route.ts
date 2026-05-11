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

        const challenges = await sql`SELECT ff.user_id, c.id, c.title, COUNT(*) as flags_par_user,  (SELECT COUNT(*) FROM flags WHERE challenge_id = c.id) as flags_totaux_challenge FROM challenges as c JOIN flags as fl ON c.id = fl.challenge_id JOIN flag_find as ff ON ff.challenge_id = c.id GROUP BY c.id, c.title, ff.user_id ORDER BY ff.user_id, c.title; `
        console.log(challenges)
        return Response.json({ success: true, data: challenges || null })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}