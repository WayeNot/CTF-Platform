import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies()
        const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)        
        
        if (!await hasPermission(Permissions.advanced.administrator, user_id) && !await hasPermission(Permissions.panelAdmin.user.session, user_id) && !await hasPermission(Permissions.panelAdmin.user.sanctions, user_id) && !await hasPermission(Permissions.panelAdmin.user.coins, user_id) && !await hasPermission(Permissions.panelAdmin.user.role, user_id) ) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        const result = await sql`SELECT DISTINCT r.id as role_id, r.label, r.color FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ${id}`
        return NextResponse.json({ success: true, data: result || null }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}