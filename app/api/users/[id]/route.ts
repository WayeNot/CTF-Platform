'use server'

import { getUserData } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(user_id: any) {
    try {
        const users = await getUserData(user_id)
        return NextResponse.json({ success: true, data: JSON.stringify(users)}, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}