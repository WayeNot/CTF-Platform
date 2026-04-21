import { sql } from "@/lib/db";
import { getUserIdBySessionId } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const challengeType = searchParams.get("type");

        const cookieStore = await cookies()
        const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value) 
        const isGuest = cookieStore.get('isGuest')?.value     

        if (challengeType === "ctf") {
            const ctf = await sql`SELECT * FROM ctf WHERE id = ${id}`;
            const flags = await sql`SELECT * FROM flags WHERE challenge_type = ${challengeType} AND challenge_id = ${id}`;
            const flag_find = await sql`SELECT * FROM flag_find WHERE user_id = ${user_id} AND challenge_id = ${id} AND type = ${challengeType}`
            const hint_show = await sql`SELECT * FROM hint_show WHERE user_id = ${user_id} AND challenge_id = ${id} AND type = ${challengeType}`

            const foundFlags = new Set(flag_find.map((f: any) => f.flag_id));
            const shownHints = new Set(hint_show.map((h: any) => h.flag_id));

            const flagsWithStatus = flags.map((flag: any) => ({...flag, found: foundFlags.has(flag.id), hint_show: shownHints.has(flag.id) }));
            return NextResponse.json({ ctf: ctf[0], flags: flagsWithStatus })
        }
        if (challengeType === "geoint") {
            const result = await sql`SELECT * FROM geoint WHERE id = ${id}`;
            return NextResponse.json(result[0])
        }
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}