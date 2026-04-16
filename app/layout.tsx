"use client"

import "./globals.css"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import Navbar from "@/components/Navbar"
import NavbarNotConnected from "@/components/NavbarNotConnected"
import Footer from "@/components/Footer"
import { NotifProvider } from "@/components/NotifProvider"
import { User } from "@/lib/types"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const pathname = usePathname()

    const getSession = async () => {
        try {
            const res = await fetch("/api/auth/session")

            if (!res.ok) {
                setUser(null)
                return
            }

            const data = await res.json()
            setUser(data)
        } catch {
            setUser(null)
        }
    }

    useEffect(() => {
        getSession()
    }, [pathname])

    return (
        <html lang="fr">
            <body className="min-h-screen flex flex-col">
                <NotifProvider>

                    {user ? <Navbar/> : <NavbarNotConnected />}

                    <main className="flex-1">
                        {children}
                    </main>

                    <Footer />

                </NotifProvider>
            </body>
        </html>
    )
}