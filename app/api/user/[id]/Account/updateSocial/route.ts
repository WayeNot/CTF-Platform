import { default_pp } from "@/lib/config";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { social } = await req.json();        

        await sql`UPDATE users SET social_media = ${JSON.stringify(social || {})} WHERE user_id = ${id}`;

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}