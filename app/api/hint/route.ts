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
        const user_id = await getUserIdBySessionId(session);        

        const coins = await sql`SELECT coins FROM users WHERE user_id = ${user_id}`;
        const hint_cost = await sql`SELECT hint_cost FROM flags WHERE id = ${flag_id} AND challenge_id = ${challenge_id} AND challenge_type = ${type}`
        
        if (coins[0].coins < hint_cost[0].hint_cost) return NextResponse.json({ success: false, error: "You don't have enough corners !" }, { status: 406 })
        const has_buy_hint = await sql`SELECT id FROM hint_show WHERE user_id = ${user_id} AND challenge_id = ${challenge_id} AND flag_id = ${flag_id} AND type = ${type} LIMIT 1`
        if (has_buy_hint.length > 0) return NextResponse.json({ success: false, error: "You have already unlocked this clue !" }, { status: 406 })
        const currentCoins = await sql`UPDATE users SET coins = coins - ${hint_cost[0].hint_cost} WHERE user_id = ${user_id} RETURNING coins`;
        await sql`INSERT INTO hint_show (user_id, challenge_id, flag_id, type) VALUES (${user_id}, ${challenge_id}, ${flag_id}, ${type})`
        return NextResponse.json({ success: true, currentCoins: currentCoins[0].coins })
    } catch (err) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}