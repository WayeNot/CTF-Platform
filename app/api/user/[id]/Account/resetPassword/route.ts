import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { password } = await req.json();

        if (password.currentPassword) {
            const goodPassword = await sql`SELECT password FROM users WHERE user_id = ${id}`;
            const hashedPassword = await bcrypt.compare(password.currentPassword, goodPassword[0].password);
            if (!hashedPassword) return NextResponse.json({ success: false, error: "Identification error." }, { status: 401 })
        }

        if (password.newPassword1 !== password.newPassword2) return NextResponse.json({ success: false, error: "The two passwords must be identical." }, { status: 401 })

        const hashedNewpassword = await bcrypt.hash(password.newPassword1, 6)

        await sql`UPDATE users SET password = ${hashedNewpassword}, reset_password = FALSE WHERE user_id = ${id}`

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}