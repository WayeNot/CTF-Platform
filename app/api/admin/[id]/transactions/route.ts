import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db"
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const cookieStore = await cookies()
        const staff_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

        if (!await hasPermission(Permissions.advanced.administrator, staff_id) && !await hasPermission(Permissions.panelAdmin.user.coins, staff_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const result = await sql`SELECT * FROM transactions WHERE user_id = ${id} ORDER BY id DESC`
        return Response.json({ success: true, data: result })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}