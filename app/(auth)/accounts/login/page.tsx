"use client";

import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { MdAccountBox } from "react-icons/md";
import { useRouter } from 'next/navigation'
import { useNotif } from "@/components/NotifProvider"
import { FaHatCowboy } from "react-icons/fa";
import Typewriter from 'typewriter-effect';
import { GiThink } from "react-icons/gi";
import ModalInput from "@/components/ModalInput";
import ModalText from "@/components/ui/ModalText";


export default function Home() {
    const { showNotif } = useNotif()
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const [displayForgotPassword, setDisplayForgotPassword] = useState(false)
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

    const handleForgotPassword = (value: string) => {
        setDisplayForgotPassword(false)
        showNotif("Une demande de réinitialisation de mot de passe a été effectué !", "success")
    }

    return (
        <div>
            <div className="lg:hidden fixed inset-0 bg-[#1e1e2f] font-mono z-50 flex items-center justify-center">
                <h2 className="text-white text-xl text-center">
                    The mobile version is coming soon.
                </h2>
            </div>

            <div className="hidden lg:block">
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-black/ border border-white/70 shadow-2xl p-6 animate-fadeIn">
                        <div className="text-[35px] font-bold text-white/70 text-center font-mono w-full mb-4">
                            <Typewriter onInit={(tw) => tw.typeString('Login').stop().start()} />
                        </div>
                        <hr className="text-white/70 w-4/5 my-5 m-auto" />
                        <div className="flex flex-col items-center w-4/5 m-auto gap-4">
                            <div className="flex flex-col items-center justify-center gap-1 w-full">
                                <input value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} className="w-full border-2 font-mono text-[20px] border-white/40 text-white/80 p-1.5" placeholder="Username" type="text" maxLength={25} />
                                <div className="w-full flex flex-col gap-2">
                                    <input value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="w-full border-2 font-mono text-[20px] border-white/40 text-white/80 p-1.5 mt-1" placeholder="Password" type="password" maxLength={50} />
                                    {/* <button onClick={() => setDisplayForgotPassword(true)} className="w-fit flex items-center gap-3 hover:underline hover:text-white text-white/30 font-mono text-[17px] cursor-pointer transition duration-500"><GiThink />Forgotten password ?</button> */}
                                </div>
                            </div>
                            <button onClick={handleLogin} className="w-full cursor-pointer flex items-center justify-center gap-3 border-2 border-white/40 text-white/40 p-2 font-mono text-[20px] hover:bg-white/40 hover:border-white/40 hover:text-white transition duration-500">Enter<BsArrowRight /></button>
                            <div className="w-full flex justify-between items-center gap-3 text-white/30 font-mono text-[17px] cursor-pointer">
                                <p onClick={handleGuest} className="flex items-center gap-3 hover:underline hover:text-white transition duration-500"><FaHatCowboy />Guest mode</p>
                                <p>|</p>
                                <p onClick={handleRedirect} className="flex items-center gap-3 hover:underline hover:text-white transition duration-500"><MdAccountBox />Register</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* {displayForgotPassword && <ModalInput title="Réinitialisation de mot de passe" input1={{ display: true, placeholder: "Quelle est votre adresse mail ?", type: "text" }} onClose={() => setDisplayForgotPassword(false)} onValidate={({ input1 }) => { handleForgotPassword(input1) }}/>} */}
        </div>
    );
}