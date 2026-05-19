import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db"
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { reason } = await req.json();
        const cookieStore = await cookies()
        const staff_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

        if (!await hasPermission(Permissions.advanced.administrator, staff_id) && !await hasPermission(Permissions.panelAdmin.user.sanctions, staff_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        await sql`INSERT INTO sanctions (type, reason, duration, user_id, staff_id) VALUES ('warn', ${reason}, 0, ${id}, ${staff_id})`
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}