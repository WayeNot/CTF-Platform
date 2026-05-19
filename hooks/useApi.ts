"use client"

import { useNotif } from "@/components/NotifProvider"

export const useApi = () => {
    const { showNotif } = useNotif()

    const call = async (url: string, options: RequestInit = {}, successMsg?: string[]) => {
        try {
            const headers = new Headers(options.headers)

            if (!(options.body instanceof FormData)) { headers.set("Content-Type", "application/json") }

            const res = await fetch(url, { ...options, headers })

            const data = await res.json()

            if (!res.ok && data.error) throw new Error(data.error)

            if (successMsg?.length) {
                successMsg.forEach(v => {
                    showNotif(v, "success")
                })
            }

            return data
        } catch (err: any) {
            showNotif(err.message, "error")
            throw err
        }
    }

    return { call }
}