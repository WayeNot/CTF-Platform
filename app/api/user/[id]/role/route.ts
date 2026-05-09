import { sql } from "@/lib/db";
import { NextResponse } from "next/dist/api/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {    
    try {
        const { id } = await params;
        
        const result = await sql`SELECT ur.role_id, r.label, r.description, r.color, rr.alias FROM user_roles ur JOIN roles r ON ur.role_id = r.id LEFT JOIN roles_relation rr ON rr.id_role = r.id WHERE ur.user_id = ${id}`;        
        
        return NextResponse.json({ success: true, data: result })
    } catch (err) {
        console.error(err)
        return new Response("DB Error", { status: 500 })
    }
}