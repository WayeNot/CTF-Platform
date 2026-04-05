import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await sql`SELECT id, feature FROM features ORDER BY id DESC`
    return NextResponse.json(result)
}

export async function POST(req: Request) {
    const { text } = await req.json()

    console.log(text);
    
    
    if ( !text ) return NextResponse.json({ success: false, error: "Aucune feature renseignée !" }, { status: 400 })

    await sql`INSERT INTO features (feature) VALUES (${text})`
    return NextResponse.json({ success: true })
}