import { randomBytes } from "crypto";
import { sql } from "./db";

export function generateSessionId() {
    return randomBytes(32).toString("hex")
}

export async function getUserIdBySessionId(session_id: any) {
    if (!session_id) return null;
    const result = await sql`SELECT user_id FROM user_session WHERE session_id = ${session_id}`
    return result[0]?.user_id ?? null
}

export async function getUserData(user_id: any) {
    return await sql`SELECT * FROM users WHERE user_id = ${user_id}`
}

export async function hasPermission(permission: string, user_id: number) {
    const result = await sql`SELECT DISTINCT rr.alias FROM user_roles ur JOIN roles r ON ur.role_id = r.id LEFT JOIN roles_relation rr ON rr.id_role = r.id WHERE ur.user_id = ${user_id} AND rr.alias IS NOT NULL`;
    const aliases = result.map(r => r.alias);    
    return aliases.includes(permission)
}