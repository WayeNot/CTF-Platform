'use server'

import { sql } from '@/lib/db'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function getRandomSession () {
    return randomBytes(32).toString('hex')
}

export async function POST(req: Request) {
    try {
        const { username, mail, password } = await req.json()

        if (!username || !mail || !password) {
            return new Response("Missing fields", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 15)
        const sessionId = await getRandomSession()

        const user = await sql`INSERT INTO users ( username, email, password ) VALUES ( ${username}, ${mail}, ${hashedPassword} ) RETURNING user_id`
        await sql`INSERT INTO user_session ( session_id, user_id ) VALUES ( ${sessionId}, ${user[0].user_id} )`

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