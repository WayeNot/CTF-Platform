import { sql } from "@/lib/db";
import { NextResponse } from "next/dist/api/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {    
    try {        
        const { id } = await params;
        
        const result = await sql`SELECT user_roles.role_id, roles.label, roles.color FROM user_roles JOIN roles ON user_roles.role_id = roles.id WHERE user_roles.user_id = ${id}`;        
                
        return NextResponse.json({ success: true, data: result }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json("DB Error", { status: 500 })
    }
}