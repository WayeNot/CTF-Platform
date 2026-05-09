import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql } from "./lib/db";
import { getUserIdBySessionId, hasPermission } from "./lib/session";
import { maintenance_route, noGuestRoute, Permissions, public_routes } from "./lib/config";

export async function proxy(request: NextRequest) {
    const session_id = request.cookies.get("session_id")?.value;
    const isGuest = request.cookies.get('isGuest')?.value;
    const path = request.nextUrl.pathname;

    const isPublicRoute = public_routes.some(route => path === route);

    const result = await sql`SELECT is_in_maintenance FROM settings LIMIT 1`;
    const is_in_maintenance = result[0]?.is_in_maintenance;

    let user_id = null;

    if (session_id) user_id = await getUserIdBySessionId(session_id);

    if (is_in_maintenance) {
        const isAllowedRole = await hasPermission(Permissions.advanced.administrator, user_id) || await hasPermission(Permissions.bypass.maintenance, user_id);

        if (path !== maintenance_route && !isAllowedRole) return NextResponse.redirect(new URL(maintenance_route, request.url));
        if (path === maintenance_route) return NextResponse.next();
    }

    if (isPublicRoute) return NextResponse.next();

    if (isGuest) {
        if (noGuestRoute.some(route => path.startsWith(route))) return NextResponse.redirect(new URL("/challenges", request.url));
        return NextResponse.next();
    }

    if (!session_id && path !== "/") {
        return NextResponse.redirect(new URL("/accounts/login", request.url));
    }

    if (!user_id) {
        const response = NextResponse.redirect(new URL("/accounts/login", request.url));
        response.cookies.delete("session_id");
        return response;
    }

    const currentSession = await sql`SELECT * FROM user_session WHERE user_id = ${user_id} AND session_id = ${session_id} AND is_active = TRUE LIMIT 1`;

    if (!currentSession[0]) {
        const response = NextResponse.redirect(new URL("/accounts/login", request.url));
        response.cookies.delete("session_id");
        return response;
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};