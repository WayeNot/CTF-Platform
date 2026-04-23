'use server'
import { cookies } from 'next/headers'
import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const cookieStore = await cookies()
    const session = cookieStore.get('session_id')?.value
    const isGuest = cookieStore.get('isGuest')?.value

    if (!session && !isGuest) {
        return NextResponse.json({ success: false }, { status: 401 })
    }

    if (!session) return Response.json({ isGuest })

    const result = await sql`SELECT u.* FROM user_session s JOIN users u ON u.user_id = s.user_id WHERE s.session_id = ${session} LIMIT 1`
    
    if (!result[0]) return NextResponse.json({ success: false, error: "Aucune session trouvée !" }, { status: 401 })
    return Response.json(result[0])
}