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

        const challenges = await sql`SELECT challenges.*, COALESCE(json_agg(DISTINCT jsonb_build_object('id', flags.id, 'flag', flags.flag, 'hint_cost', flags.hint_cost, 'points', flags.points, 'coins', flags.coins, 'challenge_id', flags.challenge_id, 'is_find', EXISTS (SELECT 1 FROM flag_find WHERE flag_find.flag_id = flags.id AND flag_find.user_id = ${id}), 'flag_found_date', (SELECT flag_find.created_at FROM flag_find WHERE flag_find.flag_id = flags.id AND flag_find.user_id = ${id} LIMIT 1))) FILTER (WHERE flags.id IS NOT NULL), '[]') AS flags FROM challenges LEFT JOIN flags ON flags.challenge_id = challenges.id GROUP BY challenges.id;`
        
        return NextResponse.json({ success: true, data: challenges || null }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}