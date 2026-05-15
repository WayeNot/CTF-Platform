import { Permissions } from "@/lib/config";
import { sql } from "@/lib/db";
import { getUserIdBySessionId, hasPermission } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { challengeId, flagId, isFind, challengeType, reward } = await req.json();

        const cookieStore = await cookies()
        const staff_id = await getUserIdBySessionId(cookieStore.get('session_id')?.value)

        if (!await hasPermission(Permissions.advanced.administrator, staff_id) && !await hasPermission(Permissions.panelAdmin.user.progression, staff_id)) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

        if (!challengeId || !flagId || !challengeType) return NextResponse.json({ success: false, error: "Missing field(s) !" }, { status: 403 });

        if (isFind) {
            await sql`DELETE FROM flag_find WHERE user_id = ${id} AND challenge_id = ${challengeId} AND flag_id = ${flagId}`
            if (reward) {
                const rew = await sql`SELECT points, coins FROM flags WHERE id = ${flagId} AND challenge_id = ${challengeId} AND challenge_type = ${challengeType}`;
                await sql`UPDATE users SET coins = coins - ${rew[0].coins}, points = points - ${rew[0].points} WHERE user_id = ${id}`
            }
        } else {
            await sql`INSERT INTO flag_find (user_id, challenge_id, flag_id, type) VALUES (${id}, ${challengeId}, ${flagId}, ${challengeType})`
            if (reward) {
                const rew = await sql`SELECT points, coins FROM flags WHERE id = ${flagId} AND challenge_id = ${challengeId} AND challenge_type = ${challengeType}`;
                await sql`UPDATE users SET coins = coins + ${rew[0].coins}, points = points + ${rew[0].points} WHERE user_id = ${id}`
            }
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}