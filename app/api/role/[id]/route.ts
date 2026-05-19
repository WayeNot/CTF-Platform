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
        
        if (!await hasPermission(Permissions.advanced.administrator, user_id) && !await hasPermission(Permissions.panelAdmin.role, user_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        
        const result = await sql`SELECT roles.*, json_agg(roles_relation.*) AS relations FROM roles LEFT JOIN roles_relation ON roles_relation.id_role = roles.id WHERE roles.id = ${id} GROUP BY roles.id`;
        
        return NextResponse.json({ success: true, data: result[0] || null }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { role } = await req.json();
        const cookieStore = await cookies();
        const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value);
                
        if (!await hasPermission(Permissions.advanced.administrator, user_id) && !await hasPermission(Permissions.panelAdmin.role, user_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        
        if (!role || !role.label || !role.description || !role.color) return NextResponse.json({ success: false, error: "Missing field(s) !" }, { status: 400 });

        await sql`UPDATE roles SET label = ${role.label}, description = ${role.description}, color = ${role.color} WHERE id = ${id}`;
        await sql`DELETE FROM roles_relation WHERE id_role = ${id}`
        for (const perm of role.allPerms) {
            await sql`INSERT INTO roles_relation (id_role, alias) VALUES (${id}, ${perm})`;
        }

        const allRoles = await sql`SELECT * FROM roles`
        return NextResponse.json({ success: true, data: allRoles }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value);
                
        if (!await hasPermission(Permissions.advanced.administrator, user_id) && !await hasPermission(Permissions.panelAdmin.role, user_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        
        await sql`DELETE FROM roles WHERE id = ${id}`;
        await sql`DELETE FROM roles_relation WHERE id_role = ${id}`;
        await sql`DELETE FROM user_roles WHERE role_id = ${id}`;

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}