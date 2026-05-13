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

        const challenges = await sql`SELECT challenges.id, challenges.title, challenges.difficulty, challenges.category, challenges.type, COUNT(DISTINCT flags.id) AS total_flags, COUNT(DISTINCT flag_find.id) AS total_flags_found FROM challenges LEFT JOIN flags ON flags.challenge_id = challenges.id LEFT JOIN flag_find ON flag_find.challenge_id = challenges.id AND flag_find.user_id = ${id} GROUP BY challenges.id;`

        return NextResponse.json({ success: true, data: challenges || null })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}