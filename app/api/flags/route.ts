import { sql } from "@/lib/db";
import { getUserIdBySessionId } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const { challenge_id, flag_id } = await req.json()

        const cookieStore = await cookies();
        const session = cookieStore.get("session_id")?.value || "";
        const isGuest = cookieStore.get('isGuest')?.value || false;

        let coins = 0;
        let points = 0;

        if (isGuest || !session) return NextResponse.json({ success: false, error: "You must be logged in to do this !" }, { status: 403 })

        const isGoodResult = await sql`SELECT coins, points FROM flags WHERE challenge_id = ${challenge_id} AND id = ${flag_id} AND challenge_type = ${type}`
        if (isGoodResult.length === 0) return NextResponse.json({ success: false, error: "Wrong flag !" })
        const user_id = await getUserIdBySessionId(session);

        await sql`INSERT INTO flag_find (user_id, challenge_id, flag_id, type) VALUES (${user_id}, ${challenge_id}, ${flag_id}, ${type})`

        const currentCoins = await sql`UPDATE users SET coins = coins + ${isGoodResult[0].coins}, points = points + ${isGoodResult[0].points} WHERE user_id = ${user_id} RETURNING coins, points`;
        coins = currentCoins[0].coins
        points = currentCoins[0].points

        const flags = await sql`SELECT id FROM flags WHERE challenge_type = ${type} AND challenge_id = ${challenge_id}`;
        const countFlags = await sql`SELECT id FROM flag_find WHERE user_id = ${user_id} AND challenge_id = ${challenge_id} AND type = ${type}`
        
        if (flags.length === countFlags.length) {
            const reward = await sql`SELECT coins, points FROM challenges WHERE type = ${type} AND id = ${challenge_id}`;
            const currentMoney = await sql`UPDATE users SET coins = coins + ${reward[0].coins}, points = points + ${reward[0].points} WHERE user_id = ${user_id} RETURNING coins, points`;
            coins = currentMoney[0].coins
            points = currentMoney[0].points
        }
        
        return NextResponse.json({ success: true, currentCoins: coins, currentPoint: points, challengeEnd: flags.length === countFlags.length })
    } catch (err) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}