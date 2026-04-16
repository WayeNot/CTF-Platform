import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql } from "./lib/db";

export async function proxy(request: NextRequest) {
    const session_id = request.cookies.get("session_id")?.value;
    const path = request.nextUrl.pathname;

    const is_in_maintenance = await sql`SELECT is_in_maintenance FROM settings`;

    // if (!is_in_maintenance) return NextResponse.redirect(new URL("/", request.url));

    const isAuthPage = path.startsWith("/accounts");

    if (!session_id && !isAuthPage) {
        return NextResponse.redirect(new URL("/accounts/login", request.url));
    }

    if (session_id && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico).*)"],
};