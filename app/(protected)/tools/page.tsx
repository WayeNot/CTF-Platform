"use client";

import { FaFire } from "react-icons/fa"
import Link from "next/link"
import { useNavData } from "@/stores/store";

export default function Home() {

    const { role } = useNavData()

    const tools = [
        { name: "Tools" },
        { name: "GEOINT" },
        { name: "SOCMINT" },
        { name: "OPSEC" },
    ]
    return (
        <div>
            <div className="lg:hidden fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <h2 className="text-white text-xl text-center">
                        The mobile version is coming soon.
                    </h2>
            </div>

            <div className="hidden lg:block"></div>

                {role && role.some(r => "guest".includes(r)) ? (
                    <div>
                        {tools.map((v, k) => (
                            <div key={k} className="blur-[6px] pointer-events-none select-none">
                                <h2 className="text-white/70 text-xl text-[30px] mt-10 ml-20 font-mono font-bold">{v.name}</h2>
                                <hr className="mt-5 mx-20 text-white/70" />
                            </div>
                        ))}
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                            <div className="w-fit max-w-fit bg-[#1e1e2f] rounded-2xl shadow-2xl p-6 animate-fadeIn">
                                <Link href="/accounts/login" className="inset-0 flex items-center justify-center gap-3 text-white/40 p-4 rounded-lg w-full border border-orange-600 text-[20px] text-center cursor-pointer hover:text-white/20 transition duration-500"><FaFire className="text-orange-500" /> Connectez-vous pour sauvegarder votre progression<FaFire className="text-orange-500" /></Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {tools.map((v, k) => (
                            <div key={k}>
                                <h2 className="text-white/70 text-xl text-[30px] mt-10 ml-20 font-mono font-bold">{v.name}</h2>
                                <hr className="mt-5 mx-20 text-white/70" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
    );
}