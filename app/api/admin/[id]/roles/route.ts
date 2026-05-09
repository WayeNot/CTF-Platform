import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const result = await sql`SELECT r.id as role_id, r.label, r.color FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = ${id}`        
        console.log(result);
        
        return NextResponse.json({ success: true, data: result || null })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
    }
}