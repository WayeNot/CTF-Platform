import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const challengeType = searchParams.get("type");

        const cookieStore = await cookies()
        const user_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)
        
        const challenge = await sql`SELECT challenges.*, json_agg(users.username) AS creators FROM challenges LEFT JOIN users ON users.user_id = ANY(challenges.creator_id) WHERE challenges.type = ${challengeType} AND challenges.id = ${id} GROUP BY challenges.id LIMIT 1`;     

        if (!challenge.length) return NextResponse.json({ success: false, error: "Challenge not found !" }, { status: 404 });

        if (challenge[0].status !== "active" && ( await hasPermission(Permissions.advanced.administrator, user_id) || !await hasPermission(Permissions.panelAdmin.challenges, user_id)) ) return NextResponse.json({ success: false, error: "You do not have the necessary permissions !" }, { status: 401 })
        
        const flags = await sql`SELECT * FROM flags WHERE challenge_type = ${challengeType} AND challenge_id = ${id} ORDER BY id ASC`;
        const flag_find = await sql`SELECT * FROM flag_find WHERE user_id = ${user_id} AND challenge_id = ${id} AND type = ${challengeType}`
        const hint_show = await sql`SELECT * FROM hint_show WHERE user_id = ${user_id} AND challenge_id = ${id} AND type = ${challengeType}`

        const foundFlags = new Set(flag_find.map((f: any) => f.flag_id));
        const shownHints = new Set(hint_show.map((h: any) => h.flag_id));
        const flagsWithStatus = flags.map((flag: any) => ({ ...flag, found: foundFlags.has(flag.id), hint_show: shownHints.has(flag.id) }));

        console.log(challenge[0]);
        
        return NextResponse.json({ challenge: challenge[0], flags: flagsWithStatus })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}