import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db"
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies()
    const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

    if (!await hasPermission(Permissions.advanced.administrator, user_id) && !await hasPermission(Permissions.panelAdmin.user.sanctions, user_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    sql`UPDATE user_session SET is_active = FALSE WHERE user_id = ${id}`
    return NextResponse.json({ success: true })
}