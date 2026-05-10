"use client";

import { FaFire } from "react-icons/fa"
import Link from "next/link"
import { useNavData } from "@/stores/store";

export default function Home() {

    const { isGuest } = useNavData()

    const tools = [
        { name: "Open Source Intelligence - Renseignement d’Origine Sources Ouvertes" },
        { name: "Identity", tools: [
            {name: "Epios", description: "Founded by a cybersecurity and OSINT specialist with more than 10 years of experience, Epieos provides training, investigation and software services to organisations and individuals. We facilitate their efforts to collect and analyse open source information.", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Finvestigators-toolbox.com%2Fwp-content%2Fuploads%2F2021%2F05%2Fepieos.png&f=1&nofb=1&ipt=7d251e47888ea11c8a0b322d02ec526519c51b5bde5b18a4497f53ddff20c354", link: "https://epieos.com/"},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
        { name: "Username", tools: [
            {name: "Test", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
        { name: "Email", tools: [
            {name: "Test", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
        { name: "Phone Number", tools: [
            {name: "Test", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
        { name: "Social Media", tools: [
            {name: "Test", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
        { name: "Companies", tools: [
            {name: "Test", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
        { name: "Geoint", tools: [
            {name: "Test", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
            {name: "", description: "", image: "", link: ""},
        ] },
    ]
    return (
        <div>
            <div className="sm:hidden fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <h2 className="text-white text-xl text-center">
                        The mobile version is coming soon.
                    </h2>
            </div>

            <div className="hidden lg:block"></div>

                {isGuest ? (
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
                                {v?.tools?.map((value, key) => (
                                    <div key={key} className="border-2 border-white/30 my-10 mx-30 p-5">
                                        <div className="flex justify-between">
                                            <p className="text-white/70 text-[25px] font-mono font-bold">{value.name}</p>
                                            <img src={value?.image} className="w-50"></img>
                                        </div>
                                        <p className="text-white/70 font-mono mt-5">{value.description}</p>
                                        <a target="_blank" className="text-white/70 underline font-mono hover:text-white transition duration-500" href={value.link}>Try the tool</a>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
    );
}