"use client"

import "./globals.css"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import Navbar from "@/components/Navbar"
import NavbarNotConnected from "@/components/NavbarNotConnected"
import Footer from "@/components/Footer"
import { NotifProvider } from "@/components/NotifProvider"
import { User } from "@/lib/types"
import { default_pp } from "@/lib/config"
import { useRouter } from 'next/navigation'
import { useNavData } from "@/stores/store"
import { useApi } from "@/hooks/useApi"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null)
    const [guest, setGuest] = useState(false)

    const { isGuest, updateIsGuest, user_id, updateUserId, username, updateUsername, email, updateEmail, role, updateRole, pp_url, updatePp_url, status, updateStatus, coins, updateCoins, updatePoints } = useNavData()

    useEffect(() => {
        
        const getSession = async () => {
            if (pathname.startsWith("/accounts")) return;
            try {
                const res = await fetch("/api/auth/session")
                if (!res.ok && !pathname.startsWith("/accounts")) {
                    router.refresh()
                    router.push("/accounts/login")
                    return
                }
                const data = await res.json()
                updateUserId(data.user_id)
                if (data.isGuest) {
                    setGuest(true)
                    setUser({ username: "Invité", status: "online", user_id: Date.now(), role: "guest", pp_url: default_pp, password: "", is_online: true, email: "guest@invite.com", coins: 9999, points: 9999, created_at: "" })
                    return
                }
                setGuest(false)
                setUser(data)
            } catch {
                setUser(null)
            }
        }
        getSession()
    }, [pathname])

    useEffect(() => {
        updateIsGuest(guest);
        updateUsername(user?.username ?? "");
        updateEmail(user?.email ?? "");
        updateRole(user?.role ? [user.role] : []);
        updatePp_url(user?.pp_url ?? "");
        updateStatus(user?.status ?? "offline");
        updateCoins(user?.coins ?? 0);
        updatePoints(user?.points ?? 0);
    }, [user]);

    return (
        <html lang="fr">
            <body className="min-h-screen flex flex-col">
                <NotifProvider>

                    {!pathname.startsWith("/accounts") && (
                        <div>
                            {user ? <Navbar /> : <NavbarNotConnected />}
                        </div>
                    )}

                    <main className="flex-1 relative">
                        {children}
                    </main>

                    {!pathname.startsWith("/accounts") && (
                        <Footer />
                    )}
                </NotifProvider>
            </body>
        </html>
    )
}