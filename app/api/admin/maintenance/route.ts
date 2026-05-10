import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await sql`SELECT is_in_maintenance FROM settings`
    return NextResponse.json(result[0].is_in_maintenance);
}

export async function PATCH(req: Request) {
    try {
        const { inMaintenance } = await req.json()
        const cookieStore = await cookies()
        const staff_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)
        
        if (!await hasPermission(Permissions.advanced.administrator, staff_id) && !await hasPermission(Permissions.bypass.maintenance, staff_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        await sql`UPDATE settings SET is_in_maintenance = ${inMaintenance}`;
        return NextResponse.json({ success: true })
    } catch (err) {
        return new Response("DB Error", { status: 500 })
    }
}