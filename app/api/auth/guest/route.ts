import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = NextResponse.json({ success: true }, { status: 200 })
        res.cookies.set("isGuest", "true")
        return res
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}