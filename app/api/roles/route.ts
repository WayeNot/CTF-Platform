import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const req = await sql`SELECT * FROM roles`
        return NextResponse.json({ success: true, data: req }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { role } = await req.json()
        const cookieStore = await cookies()
        const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)
        
        if (!await hasPermission(Permissions.advanced.administrator, user_id) && !await hasPermission(Permissions.panelAdmin.role, user_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        if (!role || !role.label || !role.description || !role.color) return NextResponse.json({ success: false, error: "Missing field(s) !" }, { status: 400 });

        const id = await sql`INSERT INTO roles (label, description, color) VALUES (${role.label}, ${role.description}, ${role.color}) RETURNING id`;
        for (const perm of role.allPerms) {
            await sql`INSERT INTO roles_relation (id_role, alias) VALUES (${id[0].id}, ${perm})`;
        }

        const allRoles = await sql`SELECT * FROM roles`
        return NextResponse.json({ success: true, data: allRoles }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        if (err.code === '23505') return NextResponse.json({ error: "Role label already used !" }, { status: 400 });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}