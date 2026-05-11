import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db"
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies()
        const staff_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

        if (!await hasPermission(Permissions.advanced.administrator, staff_id) && !await hasPermission(Permissions.panelAdmin.user.session, staff_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        await sql`UPDATE users SET reset_password = TRUE WHERE user_id = ${id}`;
        return Response.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { password } = await req.json();
        const cookieStore = await cookies()
        const staff_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

        if (!await hasPermission(Permissions.advanced.administrator, staff_id) && !await hasPermission(Permissions.panelAdmin.user.session, staff_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        const hashedPassword = await bcrypt.hash(password, 6)
        
        const newP = await sql`UPDATE users SET password = ${hashedPassword}, reset_password = FALSE WHERE user_id = ${id} RETURNING password`
        
        return Response.json({ success: true })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}