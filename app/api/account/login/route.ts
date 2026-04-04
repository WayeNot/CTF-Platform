'use server'

import { sql } from '@/lib/db'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { getRandomSession } from '../register/route'

export async function POST(req: Request) {    
    try {
        const { mail, password } = await req.json()

        if (!mail || !password) {
            return new Response("Missing fields", { status: 400 })
        }

        const user = await sql`SELECT user_id, password FROM users WHERE email = ${mail}`
        if (!user[0]) return new Response("Utilisateur non trouvé", { status: 404 })

        const isGoodPassword = await bcrypt.compare(password, user[0].password)
        
        if (!isGoodPassword) return NextResponse.json({ success: false }, { status: 401 })

        const sessionId = await getRandomSession()

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
        return new Response(err, { status: 500 })
    }
}