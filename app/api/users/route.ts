import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const req = await sql`SELECT u.user_id, u.username, u.email, u.role, u.created_at, u.coins, u.pp_url, u.status, CASE WHEN us.user_id IS NOT NULL THEN true ELSE false END as is_online FROM users u LEFT JOIN user_session us ON us.user_id = u.user_id AND us.is_active = true ORDER BY u.user_id ASC` 
        return NextResponse.json({ success: true, data: req })
    } catch (err) {
        return new Response("DB Error", { status: 500 })
    }
}