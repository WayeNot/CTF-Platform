import { sql } from "@/lib/db"
import { cookies } from "next/headers"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log("Id : ", id);
    
    sql`UPDATE user_session SET is_active = FALSE WHERE user_id = ${id}`
    return Response.json({ success: true })
}