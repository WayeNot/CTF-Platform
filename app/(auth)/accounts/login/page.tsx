"use client";

import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { MdAccountBox } from "react-icons/md";
import { useRouter } from 'next/navigation'
import { useNotif } from "@/components/NotifProvider"
import { FaHatCowboy } from "react-icons/fa";

export default function Home() {
    const { showNotif } = useNotif()
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const router = useRouter();

    const handleLogin = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: credentials.username, password: credentials.password })
        })

        if (!res.ok) {
            const err = await res.json()
            showNotif(err.error, "error")
            return
        }
        router.refresh()
        router.push("/home")
    }

    const handleRedirect = () => {
        router.refresh()
        router.push("/accounts/register")
    }

    const handleGuest = async () => {
        const req = await fetch("/api/auth/guest", {
            method: "POST"
        })
        if (!req.ok) {
            showNotif(await req.text())
            return
        }
        router.refresh()
        router.push("/home")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-full max-w-md bg-black/ border border-white/70 shadow-2xl p-6 animate-fadeIn">
                <h2 className="text-[35px] font-bold text-white/70 text-center font-mono w-full mb-4">Login</h2>
                <hr className="text-white/70 w-4/5 my-5 m-auto" />
                <div className="flex flex-col items-center w-full gap-4">
                    <div className="flex flex-col items-center justify-center gap-1 w-full">
                        <input value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} className="border-2 font-mono text-[20px] border-white/40 w-4/5 text-white/80 p-1.5" placeholder="Username" type="text" />
                        <input value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="border-2 font-mono text-[20px] border-white/40 w-4/5 text-white/80 p-1.5 mt-1" placeholder="Password" type="password" />
                    </div>
                    <button onClick={() => handleLogin()} className="cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 w-4/5 p-2 font-mono text-[20px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Enter<BsArrowRight /></button>
                    <p onClick={() => handleRedirect()} className="flex items-center gap-3 text-white/30 hover:underline font-mono text-[17px] transition duration-500 cursor-pointer hover:text-white pt-5"><MdAccountBox />Create an account</p>
                    <p onClick={() => handleGuest()} className="flex items-center gap-3 text-white/30 hover:underline font-mono text-[17px] transition duration-500 cursor-pointer hover:text-white"><FaHatCowboy />Guest mode</p>
                </div>
            </div>
        </div>
    );
}