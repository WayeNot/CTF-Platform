"use client"

import "./globals.css"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import Navbar from "@/components/NavBar/Navbar"
import NavbarNotConnected from "@/components/NavBar/NavbarNotConnected"
import Footer from "@/components/Footer"
import { NotifProvider } from "@/components/NotifProvider"
import { Status, User } from "@/lib/types"
import { default_user, public_routes } from "@/lib/config"
import { useNavData } from "@/stores/store"
import ResetPassword from "@/components/ResetPassword"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()

    const { updateIsGuest, isGuest, user_id, updateMail, updateUserId, updateBio, updateUsername, updatePublicUsername, role, updateRole, updatePp_url, updateStatus, updateCoins, updatePoints, inMaintenance, updateInMaintenance, updateResetPassword, reset_password, warn, updateWarn, updatePermissions, permissions, setSocialMedia } = useNavData()

    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (pathname.startsWith("/accounts")) return;
        const getSettings = async () => {
            const req = await fetch("/api/admin/maintenance")
            const data = await req.json()
            updateInMaintenance(data)
        }
        getSettings()
    }, [])

    const loadUserData = async (id: number) => {
        const [roles, permissions, warn] = await Promise.all([
            await fetch(`/api/user/${id}/role`).then(r => r.json()),
            await fetch(`/api/user/${id}/permissions`).then(r => r.json()),
            await fetch(`/api/user/${id}/sanctions/warn`).then(r => r.json()),
        ])

        if (roles?.data) updateRole(roles.data)
        if (permissions?.data) updatePermissions(permissions.data)
        if (warn) updateWarn(warn)
    }

    useEffect(() => {
        if (public_routes.some(v => v === pathname)) return;
        const getSession = async () => {
            const res = await fetch("/api/auth/session")
            if (!res.ok) return;

            const data = await res.json()            

            if (data.isGuest) {
                updateIsGuest(true)
                setUser(default_user)
                return
            }

            updateUserId(data.data.user_id)

            updateIsGuest(false)
            setUser(data.data)
            updateResetPassword(data.data.reset_password)
        }
        getSession();
    }, [pathname])

    useEffect(() => {
        if (!user_id || user_id < 0 || isGuest) return
        loadUserData(user_id)
    }, [user_id, isGuest])

    useEffect(() => {        
        if (public_routes.includes(pathname) || !user) return;

        updateIsGuest(isGuest)
        updateUsername(user.username ?? "")
        updateBio(user.bio ?? "")
        updateMail(user.mail ?? "")
        updatePublicUsername(user.is_anonymous ? "Anonyme" : user.username ?? "")
        updatePp_url(user.pp_url ?? "")
        updateStatus(user.status as Status ?? "offline")
        updateCoins(user.coins ?? 0)
        updatePoints(user.points ?? 0)
        updateResetPassword(user.reset_password ?? false)
        setSocialMedia(user.social_media)
    }, [user, isGuest, pathname])

    const handleChangePassword = async (p1: any, p2: any) => {
        const data = await fetch(`/api/user/${user_id}/Account/resetPassword`, { method: "PATCH", body: JSON.stringify({ password: { newPassword1: p1, newPassword2: p2 } }) })
        if (!data.ok) return;
        updateResetPassword(false);
    }

    return (
        <html lang="fr">
            <body className="min-h-screen flex flex-col">
                <NotifProvider>
                    {(!public_routes.some(v => v === pathname)) && (user_id >= 0 || isGuest) && <Navbar />}
                    {(pathname === "/" || pathname === "/dev/maintenance") && <NavbarNotConnected />}
                    <main className="flex-1 relative">{children}</main>
                    {!pathname.startsWith("/accounts") && <Footer />}
                    {pathname !== "/" && !pathname.startsWith("/accounts") && user_id > 0 && reset_password && <ResetPassword onValidate={({ input1, input2 }) => { handleChangePassword(input1, input2) }} />}
                </NotifProvider>
            </body>
        </html>
    )
}