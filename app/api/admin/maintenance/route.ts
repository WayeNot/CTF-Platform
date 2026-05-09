import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await sql`SELECT is_in_maintenance FROM settings`
    return NextResponse.json(result[0].is_in_maintenance);
}

export async function PATCH(req: Request) {
    try {
        const { inMaintenance } = await req.json()
        await sql`UPDATE settings SET is_in_maintenance = ${inMaintenance}`;
        return NextResponse.json({ success: true })
    } catch (err) {
        return new Response("DB Error", { status: 500 })
    }
}