'use server'

import { sql } from '@/lib/db'
import { redirect } from "next/navigation";
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function getUserIdBySessionId (session_id: any) {
    const result = await sql`SELECT user_id FROM user_session WHERE session_id = ${session_id}`
    return result[0].user_id
}

export async function getUserData (user_id: any) {
    return await sql`SELECT * FROM users WHERE user_id = ${user_id}`
}

export async function GET(user_id: any) {
    try {
        const users = await getUserData(user_id)
        return new Response(JSON.stringify(users), { status: 200 })
    } catch (err) {
        console.error(err)
        return new Response("DB Error", { status: 500 })
    }
}