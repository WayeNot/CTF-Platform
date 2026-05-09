import { sql } from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET() {
    const req = await sql`SELECT * FROM permissions`
    return NextResponse.json(req)
}

export async function POST(req: Request) {
    try {
        const { name, description } = await req.json()

        if (!name || !description) return NextResponse.json({ success: false, error: "Champs manquants !" }, { status: 400 });

        await sql`INSERT INTO permissions (name, description) VALUES (${name}, ${description})`;

        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}