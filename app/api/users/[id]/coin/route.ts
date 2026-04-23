import { sql } from "@/lib/db";
import { getUserIdBySessionId } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { operation, value, reason } = await req.json()
        const cookieStore = await cookies()
        const session_id = cookieStore.get('session_id')?.value
        let staff_id = await getUserIdBySessionId(session_id)

        if (!staff_id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        let newSold = 0;

        if (operation === "add_coins") {
            const currentCoins = await sql`UPDATE users SET coins = coins + ${value} WHERE user_id = ${id} RETURNING coins`;
            newSold = currentCoins[0].coins;
        } else if (operation === "remove_coins") {
            const getCoins = await sql`SELECT coins FROM users WHERE user_id = ${id}`;
            if (getCoins[0].coins - value < 0) return NextResponse.json({ success: false, error: "Impossible de retirer plus que ce qu'il possède déjà !" }, { status: 500 })
            const currentCoins = await sql`UPDATE users SET coins = ${getCoins[0].coins - value} WHERE user_id = ${id} RETURNING coins`;
            newSold = currentCoins[0].coins
        } else if (operation === "reset_coins") {
            await sql`UPDATE users SET coins = coins - coins WHERE user_id = ${id}`;
            newSold = 0
        } else if (operation === "set_coins") {
            const currentCoins = await sql`UPDATE users SET coins = ${value} WHERE user_id = ${id} RETURNING coins`;
            newSold = currentCoins[0].coins;
        }

        await sql`INSERT INTO transactions (user_id, staff_id, amount, type, reason) VALUES (${Number(id)}, ${Number(staff_id)}, ${Number(value)}, ${operation}, ${reason || ""})`;

        return NextResponse.json({ newSold })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}