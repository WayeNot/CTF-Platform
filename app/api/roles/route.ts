import { sql } from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const req = await sql`SELECT * FROM roles`
        return NextResponse.json({ success: true, data: req })
    } catch (err) {
        console.error(err)
        return new Response("DB Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { role } = await req.json()

        if (!role || !role.label || !role.description || !role.color) return NextResponse.json({ success: false, error: "Champs manquants !" }, { status: 400 });

        const id = await sql`INSERT INTO roles (label, description, color) VALUES (${role.label}, ${role.description}, ${role.color}) RETURNING id`;
        for (const perm of role.allPerms) {
            await sql`INSERT INTO roles_relation (id_role, alias) VALUES (${id[0].id}, ${perm})`;
        }
        
        const allRoles = await sql`SELECT * FROM roles`
        return NextResponse.json({ success: true, data: allRoles })
    } catch (err: any) {
        // console.error(err);
        if (err.code === '23505') return NextResponse.json({ error: "Label de rôle déjà utilisé !" }, { status: 400 });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}