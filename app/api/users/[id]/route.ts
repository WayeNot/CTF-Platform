'use server'

import { getUserData } from '@/lib/session';

export async function GET(user_id: any) {
    try {
        const users = await getUserData(user_id)
        return new Response(JSON.stringify(users), { status: 200 })
    } catch (err) {
        return new Response("DB Error", { status: 500 })
    }
}

export async function PATCH () {
    console.log("Modification de l'utilisateur");
}