"use client"

import "./globals.css"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import Navbar from "@/components/NavBar/Navbar"
import NavbarNotConnected from "@/components/NavBar/NavbarNotConnected"
import Footer from "@/components/Footer"
import { NotifProvider } from "@/components/NotifProvider"
import { Role, Status, User } from "@/lib/types"
import { default_pp, default_user, maintenance_role } from "@/lib/config"
import { useRouter } from 'next/navigation'
import { useNavData } from "@/stores/store"
import NavbarLight from "@/components/NavBar/NavbarLight";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null)
    const [guest, setGuest] = useState(false)

    const { updateIsGuest, user_id, updateUserId, updateUsername, updatePublicUsername, updateEmail, role, updateRole, updatePp_url, updateStatus, updateCoins, updatePoints, inMaintenance, updateInMaintenance, updateResetPassword, warn, updateWarn } = useNavData()

    useEffect(() => {
        const getSettings = async () => {
            if (pathname.startsWith("/accounts")) return;
            const req = await fetch("/api/admin/maintenance")
            const data = await req.json()
            updateInMaintenance(data)
        }
        getSettings()
    }, [])

    useEffect(() => {
        if (pathname.startsWith("/accounts")) return;
        const getSession = async () => {
            try {
                const res = await fetch("/api/auth/session")
                const data = await res.json()
                updateUserId(data.user_id)
                if (data.isGuest) {
                    setGuest(true)
                    setUser({ username: default_user.username, is_anonymous: false, status: default_user.status as Status, user_id: default_user.user_id, role: ["user"], pp_url: default_user.pp_url, password: default_user.password, is_online: default_user.is_online, email: default_user.email, coins: default_user.coins, points: default_user.points, created_at: default_user.created_at, reset_password: false, banner: "" })
                    return
                }
                setGuest(false)
                setUser(data)
            } catch {
                setUser(null)
            }
        }
        const getWarn = async () => {
            const warn = await fetch(`/api/users/${user_id}/sanctions/warn`)
            const data = await warn.json()            
            if (data) updateWarn(data)
        }
        getSession();
        if (user_id >= 0) getWarn();
    }, [pathname])

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        setUser(null)
        updateIsGuest(false)
    }

    useEffect(() => {
        inMaintenance && !maintenance_role.includes(role as any) && handleLogout();
    }, [inMaintenance, role])

    useEffect(() => {
        updateIsGuest(guest);
        updateUsername(user?.username ?? "");
        updateEmail(user?.email ?? "");
        updateRole(user?.role || []);
        updatePublicUsername(user?.is_anonymous ? "Anonyme" : user?.username ?? "")
        updatePp_url(user?.pp_url ?? "");
        updateStatus(user?.status ?? "offline");
        updateCoins(user?.coins ?? 0);
        updatePoints(user?.points ?? 0);
        updateResetPassword(user?.reset_password ?? false)
        updateWarn(warn || null)
    }, [user]);

    return (
        <html lang="fr">
            <body className="min-h-screen flex flex-col">
                <NotifProvider>
                    {pathname.startsWith("/user") && <NavbarLight />}
                    {!pathname.startsWith("/user") && pathname !== "/" && !pathname.startsWith("/accounts") && user && <Navbar />}
                    {pathname === "/" && <NavbarNotConnected />}
                    <main className="flex-1 relative">{children}</main>
                    {!pathname.startsWith("/accounts") && <Footer />}
                </NotifProvider>
            </body>
        </html>
    )
}