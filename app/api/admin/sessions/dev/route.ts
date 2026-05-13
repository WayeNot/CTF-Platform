import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { generateSessionId, hasPermission } from "@/lib/session";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        if (!username || !password || typeof username !== "string" || typeof password !== "string") return NextResponse.json({ success: false, error: "Missing field(s) !" }, { status: 400 })

        const user = await sql`SELECT user_id, password, role FROM users WHERE username = ${username} LIMIT 1`

        const hash = user[0]?.password ?? "$2a$10$invalidhashinvalidhashinvalidhashinv"
        const isGoodPassword = await bcrypt.compare(password, hash)

        const user_id = user[0].user_id

        const isAllowedRole = await hasPermission(Permissions.advanced.administrator, user_id) || await hasPermission(Permissions.bypass.maintenance, user_id);
        
        if (!user[0] || !isGoodPassword || !isAllowedRole) return NextResponse.json({ success: false, error: "Identification error / unauthorized role." }, { status: 401 })

        const sessionId = generateSessionId()

        await sql`WITH disabled AS (UPDATE user_session SET is_active = FALSE WHERE user_id = ${user_id}) INSERT INTO user_session (session_id, user_id) VALUES (${sessionId}, ${user_id})`
        
        const res = NextResponse.json({ success: true })

        res.cookies.set('session_id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })

        return res
    } catch (err: any) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}