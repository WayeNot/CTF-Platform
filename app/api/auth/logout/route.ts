import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies()
        const session_id = cookieStore.get("session_id")?.value
        sql`UPDATE user_session SET is_active = FALSE WHERE session_id = ${session_id}`
        cookieStore.delete('session_id')
        cookieStore.delete('isGuest')
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }

}