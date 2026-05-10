import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db"
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { roles } = await req.json();

    const cookieStore = await cookies()
    const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

    if (!await hasPermission(Permissions.panelAdmin.role, user_id) && !await hasPermission(Permissions.advanced.administrator, user_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    try {
        await sql`DELETE FROM user_roles WHERE user_id = ${id}`;
        for (const role of roles) {
            await sql`INSERT INTO user_roles (user_id, role_id) VALUES (${id}, ${role.value}) ON CONFLICT (user_id, role_id) DO NOTHING;`
        }
        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}