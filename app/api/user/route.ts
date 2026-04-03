'use server'

import { sql } from '@/lib/db'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const users = await sql`SELECT * FROM users`
        return new Response(JSON.stringify(users), { status: 200 })
    } catch (err) {
        console.error(err)
        return new Response("DB Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { username, mail, password } = await req.json()

        if (!username || !mail || !password) {
            return new Response("Missing fields", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 15);
        const sessionId = randomBytes(32).toString('hex')

        const user = await sql`INSERT INTO users ( username, email, password ) VALUES ( ${username}, ${mail}, ${hashedPassword} ) RETURNING id`
        const userId = user[0].id
        await sql`INSERT INTO user_session ( session_id, user_id ) VALUES ( ${sessionId}, ${userId} )`

        const res = NextResponse.json({ success: true })

        res.cookies.set('session_id', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
        })

        return res
    } catch (err: any) {
        console.error(err)

        if (err.code === '23505') {
            return new Response("Email déjà pris !", { status: 400 })
        }

        return new Response("DB Error", { status: 500 })
    }
}