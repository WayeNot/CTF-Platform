import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql } from "./lib/db";
import { getRole, getUserIdBySessionId } from "./lib/session";
import { maintenance_route, maitenance_role, noGuestRoute, public_routes } from "./lib/config";

export async function proxy(request: NextRequest) {
    const session_id = request.cookies.get("session_id")?.value;
    const isGuest = request.cookies.get('isGuest')?.value
    const path = request.nextUrl.pathname;

    if (path.startsWith("/accounts")) request.cookies.delete('isGuest')

    if (isGuest && noGuestRoute.some(route => path.startsWith(route))) return NextResponse.redirect(new URL("/challenges", request.url));

    const isPublicRoute = public_routes.includes(path)

    const result = await sql`SELECT is_in_maintenance FROM settings LIMIT 1`;
    const is_in_maintenance = result[0]?.is_in_maintenance

    let role = null

    if (session_id) {
        const user_id = await getUserIdBySessionId(session_id)
        if (user_id) role = await getRole(user_id)
    }

    if (isGuest) {
        role = "guest"
    }

    if (is_in_maintenance) {
        const isAllowedRole = role ? maitenance_role.includes(role) : false
        if (!isPublicRoute && !isAllowedRole) return NextResponse.redirect(new URL(maintenance_route, request.url));
    }

    if (!session_id && !isGuest && !path.startsWith("/accounts") && !isPublicRoute) return NextResponse.redirect(new URL("/accounts/login", request.url));

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}