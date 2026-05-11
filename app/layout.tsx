"use client"

import "./globals.css"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import Navbar from "@/components/NavBar/Navbar"
import NavbarNotConnected from "@/components/NavBar/NavbarNotConnected"
import Footer from "@/components/Footer"
import { NotifProvider } from "@/components/NotifProvider"
import { Status, User } from "@/lib/types"
import { default_user, Permissions, public_routes } from "@/lib/config"
import { useRouter } from 'next/navigation'
import { useNavData } from "@/stores/store"
import ResetPassword from "@/components/ResetPassword"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const [user, setUser] = useState<User | null>(null)
    const [guest, setGuest] = useState(false)

    const { updateIsGuest, isGuest, user_id, updateUserId, updateUsername, updatePublicUsername, updateEmail, role, updateRole, updatePp_url, updateStatus, updateCoins, updatePoints, inMaintenance, updateInMaintenance, updateResetPassword, reset_password, warn, updateWarn, updatePermissions, permissions } = useNavData()

    useEffect(() => {
        if (pathname.startsWith("/accounts")) return;
        const getSettings = async () => {
            const req = await fetch("/api/admin/maintenance")
            const data = await req.json()
            updateInMaintenance(data)
        }
        getSettings()
    }, [])

    useEffect(() => {
        if (public_routes.some(v => v === pathname)) return;
        const getSession = async () => {
            try {
                const res = await fetch("/api/auth/session")
                if (!res.ok) return;
                const data = await res.json()
                updateUserId(data.user_id)
                if (data.isGuest) {
                    setGuest(true)
                    setUser({ username: default_user.username, bio: "", is_anonymous: false, status: default_user.status as Status, user_id: default_user.user_id, role: ["user"], pp_url: default_user.pp_url, password: default_user.password, is_online: default_user.is_online, email: default_user.email, coins: default_user.coins, points: default_user.points, created_at: default_user.created_at, reset_password: false, banner: "" })
                    return
                }
                setGuest(false)
                setUser(data)                
                updateResetPassword(data.reset_password)
            } catch {
                setUser(null)
            }
        }       
        getSession();
    }, [pathname])

    useEffect(() => {
        if (public_routes.some(v => v === pathname)) return;
        const getRoles = async () => {
            const roles = await fetch(`/api/user/${user_id}/role`)
            const dataRoles = await roles.json()
            dataRoles && updateRole(dataRoles.data)
        }
        const getPermissions = async () => {
            const perm = await fetch(`/api/user/${user_id}/permissions`)
            const DataPerm = await perm.json()
            DataPerm && updatePermissions(DataPerm.data)
        }
        const getWarn = async () => {
            const warn = await fetch(`/api/users/${user_id}/sanctions/warn`)
            const data = await warn.json()
            if (data) updateWarn(data)
        }
        if (user_id !== -1 && !isGuest) { getPermissions(); getRoles(); getWarn();}
    }, [user_id])

    useEffect(() => {
        if (public_routes.some(v => v === pathname)) return;
        
        updateIsGuest(guest);
        updateUsername(user?.username ?? "");
        updateEmail(user?.email ?? "");
        updatePublicUsername(user?.is_anonymous ? "Anonyme" : user?.username ?? "")
        updatePp_url(user?.pp_url ?? "");
        updateStatus(user?.status ?? "offline");
        updateCoins(user?.coins ?? 0);
        updatePoints(user?.points ?? 0);
        updateResetPassword(user?.reset_password ?? false)
        updateWarn(warn || null)
    }, [user]);

    const handleChangePassword = async (value: any) => {
        const data = await fetch(`/api/admin/${user_id}/session/resetPassword`, { method: "PATCH", body: JSON.stringify({ password: value })}) 
        if (!data.ok) return;
        updateResetPassword(false);
    }
    
    return (
        <html lang="fr">
            <body className="min-h-screen flex flex-col">
                <NotifProvider>
                    {(!public_routes.some(v => v === pathname)) && ( user_id > 0 || isGuest ) && <Navbar/>}
                    {pathname !== "/" && !pathname.startsWith("/accounts") && user_id > 0 && reset_password && <ResetPassword onValidate={({ input1 }) => { handleChangePassword(input1)} } />}
                    {( pathname === "/" || pathname === "/dev/maintenance" ) && <NavbarNotConnected/>}
                    <main className="flex-1 relative">{children}</main>
                    {!pathname.startsWith("/accounts") && <Footer />}
                </NotifProvider>
            </body>
        </html>
    )
}