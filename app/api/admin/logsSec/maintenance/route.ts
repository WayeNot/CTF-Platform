import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { inMaintenance } = await req.json()
        if (inMaintenance) {
            await sql`UPDATE settings SET is_in_maintenance = FALSE`;
            return NextResponse.json({ success: true })
        }
        await sql`UPDATE user_session SET is_active = FALSE WHERE is_active = TRUE`;
        await sql`UPDATE settings SET is_in_maintenance = TRUE`;
        const res = NextResponse.json({ success: true })
        res.cookies.delete('session_id')
        return res
    } catch (err) {
        console.error(err)
        return new Response("DB Error", { status: 500 })
    }
}