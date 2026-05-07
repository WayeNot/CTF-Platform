import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql } from "./lib/db";
import { getRole, getUserIdBySessionId } from "./lib/session";
import { maintenance_role, maintenance_route, noGuestRoute, public_routes } from "./lib/config";

export async function proxy(request: NextRequest) {
    const session_id = request.cookies.get("session_id")?.value;
    const user_id = await getUserIdBySessionId(session_id);
    const isGuest = request.cookies.get('isGuest')?.value;
    const path = request.nextUrl.pathname;

    const result = await sql`SELECT is_in_maintenance FROM settings LIMIT 1`;
    const is_in_maintenance = result[0]?.is_in_maintenance;

    let role = null;

    if (session_id && user_id) role = await getRole(user_id);
    if (isGuest) role = "guest";

    const isPublicRoute = public_routes.some(route => path === route);

    if (is_in_maintenance) {
        const isAllowedRole = role && maintenance_role.includes(role);        

        if (path !== maintenance_route && !isAllowedRole) {
            request.cookies.delete("session_id")
            request.cookies.delete("isGuest")
            return NextResponse.redirect(new URL("/dev/maintenance", request.url));
        }
    }    

    if (!session_id && !isPublicRoute && !isGuest && path !== "/" && !is_in_maintenance) return NextResponse.redirect(new URL("/accounts/login", request.url));

    if (isGuest && noGuestRoute.some(route => path.startsWith(route))) return NextResponse.redirect(new URL("/challenges", request.url));

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};