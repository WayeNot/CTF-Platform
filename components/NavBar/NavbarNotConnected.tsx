"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { BsArrowRight } from "react-icons/bs"
import { useApi } from "@/hooks/useApi"
import { RxCross2 } from "react-icons/rx";
import Typewriter from 'typewriter-effect';
import Link from "next/link";
import { useNavData } from "@/stores/store";

export default function NavbarNotConnected() {

    const { isGuest, updateIsGuest, user_id, updateUserId, username, updateUsername, email, updateEmail, role, updateRole, pp_url, updatePp_url, status, updateStatus, coins, updateCoins, updatePoints, inMaintenance, updateInMaintenance } = useNavData();

    const { call } = useApi()
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false)

    const [displayLogin, setDisplayLogin] = useState(false)
    const [login, setLogin] = useState({ code: "", username: "", password: "" })

    const handleLogin = async () => {
        await call("/api/admin/sessions/dev", { method: "POST", body: JSON.stringify({ username: login.username, password: login.password }) })
        setDisplayLogin(false)
        router.refresh()
        router.push("/home")
    }

    return (
        <div>
            <nav className="flex items-center justify-between p-4 sm:mx-5">
                <a href="/home" className="text-xl h-fit sm:text-2xl text-white/60 font-mono">FlagCore</a>

                <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-white text-2xl">☰</button>

                <div className="hidden sm:flex items-center gap-5 text-white/40 font-mono">
                    {inMaintenance ? (
                        <button onClick={() => setDisplayLogin(true)}>Login</button>
                    ) : (
                        <div>
                            <Link href={"/accounts/login"} className="hover:text-white/70 hover:text-underline border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 text-[20px]">Login</Link>
                            <Link href={"/accounts/register"} className="hover:text-white/70 hover:text-underline border-2 border-[#212529] hover:border-t-2 hover:border-b-2 hover:border-t-white hover:border-b-white pt-1 pb-1 transition duration-500 text-[20px] mr-8 ml-10">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {menuOpen && (
                <div className="sm:hidden px-4 pb-4 animate-fadeIn">
                    <div className="flex flex-col gap-3">
                        {inMaintenance ? (
                            <button onClick={() => setDisplayLogin(true)}>Connexion</button>
                        ) : (
                            <Link href={"/accounts/login"} className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-[#3a3a4d] transition duration-500">Connexion</Link>
                        )}
                    </div>
                </div>
            )}
            {displayLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 w-full max-w-md bg-[#212529] border border-white/40 shadow-2xl p-6 animate-fadeIn">
                        <div className="relative w-full flex justify-center">
                            <h2 className="text-[25px] font-bold text-white/70 text-center font-mono w-full">Administrator login</h2>
                            <button onClick={() => setDisplayLogin(false)} className="absolute right-0 top-0 text-white/60 hover:text-red-500 transition duration-500 cursor-pointer"><RxCross2 size={25} /></button>
                        </div>
                        <hr className="text-white/70 w-4/5 my-5 m-auto" />
                        <div className="flex flex-col items-center w-full gap-4">
                            <div className="flex flex-col items-center justify-center gap-1 w-full">
                                <input value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} className="border-2 font-mono text-[20px] border-white/40 w-4/5 text-white/80 p-1.5 mb-1" placeholder="Username" type="text" maxLength={25} />
                                <input value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} className="border-2 font-mono text-[20px] border-white/40 w-4/5 text-white/80 p-1.5" placeholder="Password" type="password" maxLength={50} />
                            </div>
                            <button onClick={() => handleLogin()} className="cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 w-4/5 p-2 font-mono text-[20px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Enter<BsArrowRight /></button>
                        </div>
                    </div>
                </div>
            )}
            <div className="border-b border-gray-700/50"></div>
        </div>
    )
}