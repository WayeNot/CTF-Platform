import { sql } from "@/lib/db";
import { NextResponse } from "next/dist/api/server";

export async function GET({ params }: { params: Promise<{ id: string }> }) {    
    try {
        const { id } = await params;
        
        const result = await sql`SELECT DISTINCT rr.alias FROM user_roles ur JOIN roles r ON ur.role_id = r.id LEFT JOIN roles_relation rr ON rr.id_role = r.id WHERE ur.user_id = ${id} AND rr.alias IS NOT NULL`;
        const aliases = result.map(r => r.alias);                
        return NextResponse.json({ success: true, data: aliases }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}