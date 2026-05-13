"use client"

import { useNotif } from '@/components/NotifProvider'
import { useApi } from '@/hooks/useApi'
import { ctf, flags } from '@/lib/types'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CiCircleCheck } from 'react-icons/ci'
import { FaLightbulb } from 'react-icons/fa'
import { LuLightbulbOff } from 'react-icons/lu'
import ModalBool from '@/components/ui/ModalBool'
import { useNavData } from '@/stores/store'
import ModalText from '@/components/ui/ModalText'

export default function Page() {
    const { showNotif } = useNotif()
    const { updateCoins, updatePoints, isGuest, public_username } = useNavData()
    const { call } = useApi()
    const params = useParams();
    const router = useRouter();

    const [ctf, setCtf] = useState<ctf>()
    const [ctfFlags, setCtfFlags] = useState<flags[]>([])
    const [currentFlags, setCurrentFlags] = useState<Record<number, string>>({})
    const [creatorName, setCreatorName] = useState("")

    const [showModalBool, setShowModalBool] = useState(false)
    const [showModalText, setShowModalText] = useState(false)
    const [selectedFlag, setSelectedFlag] = useState<flags | null>(null);

    const foundCount = ctfFlags.filter(el => el.found).length;
    const flagsLen = ctfFlags.length

    let date = new Date()

    useEffect(() => {
        if (!params?.id) return;
        const getCtf = async () => {
            const request = await fetch(`/api/challenges/${params.id}?type=ctf`)
            const data = await request.json()
            if (data.error) {
                router.refresh()
                router.push("/challenges")
                showNotif(data.error)
                return
            }
            if (!data.challenge) {
                router.refresh()
                router.push("/challenges")
                showNotif("This challenge does not exist / no longer exists !")
                return
            }
            setCtf(data.challenge)
            setCtfFlags(data.flags)
            setCreatorName(data.creator)
        }
        getCtf()
    }, [params.id])

    const handleHint = async (id: number) => {
        id = Number(id)
        const flagObj = ctfFlags.find(el => el.id === id);
        if (!flagObj) return;

        const data = await call(`/api/hint/?type=ctf`, { method: "POST", body: JSON.stringify({ challenge_id: params.id, flag_id: id }) }, ["Vous venez de déverouiller cet indice !", `-${flagObj.hint_cost} coins !`])
        setCtfFlags(prev => prev.map((el) => el.id === id ? { ...el, hint_show: true } : el))
        updateCoins(data.currentCoins)
        setShowModalBool(false);
        setShowModalText(true)
    }

    const handleValidate = async (id: number) => {
        const flagObj = ctfFlags.find(el => el.id === id);
        if (!flagObj) return;

        const input = currentFlags[id] || "";

        if (!input || input === "") {
            showNotif("Please enter a flag !")
            return
        }

        if (input === `${ctf?.flag_format}{${flagObj.flag}}`) {
            const data = await call(`/api/flags/?type=ctf`, { method: "POST", body: JSON.stringify({ challenge_id: params.id, flag_id: id }) }, ["GG ! Vous venez de résoudre ce flag ", `+${flagObj.coins} coins | +${flagObj.points} points !`]);

            setCtfFlags(prev =>
                prev.map(f =>
                    f.id === id ? { ...f, found: true } : f
                )
            );

            setCurrentFlags(prev => ({
                ...prev,
                [id]: ""
            }));

            updateCoins(data.currentCoins)
            updatePoints(Number(data.currentPoint))

            if (data.challengeEnd) {
                updateCoins(Number(data?.currentCoins))
                updatePoints(Number(data?.currentPoint))
                showNotif("GG, you have just completed the challenge !", "success")
                showNotif(`+${ctf?.coins} coins | +${ctf?.points} points !`, "success")
            }
        } else {
            showNotif("No, not this time !")
        }
    };

    return (
        <div>
            <div className="sm:hidden fixed inset-0 bg-black z-50 flex items-center justify-center">
                <h2 className="text-white text-xl text-center">
                    The mobile version is coming soon.
                </h2>
            </div>

            <div className="hidden lg:block"></div>
            <div className="flex flex-col bg-[#212529]">
                
                <div className="py-5 px-4 bg-[#212529] flex flex-col items-center justify-center gap-5">
                    {foundCount === flagsLen && (
                        <p className="w-fit px-4 py-2 bg-[#212529] border-2 border-white/30 text-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-3"><span className="text-green-600"><CiCircleCheck /></span>Vous avez terminé {ctf?.title} !</p>
                    )}
                    <div className='w-fit border-2 border-white/30 pl-50 pr-50 pt-10'>
                        <h2 className="text-white/60 font-mono text-[40px] text-center">CTF - {ctf?.title} | Difficulty : {ctf?.difficulty}</h2>
                        <p className='text-center my-2 text-white/40 font-mono mb-5'>Created by : {creatorName !== "Inconnu" && creatorName !== "Anonyme" ? <Link className={"cursor-pointer hover:text-white/60 transition duration-500 italic"} href={`/user/${creatorName}`}>{creatorName}</Link> : <span className="cursor-pointer hover:text-white/60 transition duration-500 italic">Inconnu</span>} | {ctf?.created_at && new Date(ctf?.created_at).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <p className="text-center w-full sm:w-2/3 lg:w-1/2 text-white/40 text-sm sm:text-base leading-relaxed mt-10">{ctf?.description}</p>
                    <div className='text-center mt-10 border-2 border-white/30 pt-10 pl-110 pr-110'>
                        {ctf?.files?.map((v, k) => (
                            <Link key={k} href={v} target="_blank" className="border-2 px-4 py-2 font-mono text-[20px] text-white/60 hover:bg-white hover:text-black hover:border-white transition duration-500">Starting resource</Link>
                        ))}
                        <p className='font-mono text-white/30 mt-7 mb-8'>* Warning : this button downloads content</p>
                    </div>

                    <div className="border-2 border-white/30 p-15 mb-20">

                    <p className="text-white/60 font-mono text-[25px] mb-10 text-center">Your progress : <span className={`font-semibold ${foundCount === flagsLen ? "text-green-600" : foundCount >= flagsLen / 2 ? "text-orange-500" : "text-red-600"}`}>{foundCount}</span> / {flagsLen}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                        {ctfFlags.map((v, k) => (
                            <div key={k} className="w-full h-full min-h-65  bg-[#191c1f] border border-white/30 shadow-2xl p-6 flex flex-col justify-around">
                                <div className='flex flex-col'>
                                    <h2 className="text-xl font-semibold text-white/70 font-mono">{v.title}</h2>
                                    <p className="text-xs text-white/40 mb-4 mt-2 font-mono">{v.description}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <div className="flex items-center gap-2 mb-4">
                                        {v.found ? (
                                            <div className="flex-1 relative">
                                                <input value={""} disabled type="text" placeholder="You have already found this flag !" className="w-full h-11 px-4 pr-10 bg-[#212529] border-2 border-white/30 placeholder:text-green-800 focus:outline-none focus:ring-2 focus:ring-white/70 text-sm transition" />
                                            </div>) : (
                                            <div className="flex-1 relative">
                                                <input value={currentFlags[v.id] || ""} onChange={(e) => setCurrentFlags(prev => ({ ...prev, [v.id]: e.target.value }))} type="text" placeholder={`${ctf?.flag_format}{${v.flag_format}}`} className="w-full h-11 px-4 pr-10 bg-[#212529] border-2 border-white/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/70 text-sm transition" />
                                            </div>
                                        )}
                                        {v.hint ? (
                                            <div>
                                                {v.hint_show ? (
                                                    <button onClick={() => { setSelectedFlag(v); setShowModalText(true); }} className="h-11 w-11 flex items-center justify-center bg-[#212529] border-2 border-white/30 text-green-600 hover:text-green-700 hover:border-green-700 transition duration-500 cursor-pointer"><FaLightbulb /></button>
                                                ) : (
                                                    <button onClick={() => { setSelectedFlag(v); setShowModalBool(true); }} className="h-11 w-11 flex items-center justify-center bg-[#212529] border-2 border-white/30 text-white/70 hover:text-yellow-300 hover:border-yellow-400 transition duration-500 cursor-pointer"><FaLightbulb /></button>
                                                )}
                                            </div>
                                        ) : (
                                            <button onClick={() => showNotif("No clues for this flag !")} className="h-11 w-11 flex items-center justify-center bg-[#212529] border-2 border-white/30 text-white hover:text-red-500 hover:border-red-500 transition duration-500 cursor-pointer"><LuLightbulbOff /></button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {v.found ? (
                                            <button onClick={() => showNotif("You've already solved this flag !", "success")} className="flex-1 bg-[#212529] hover:bg-[#51565c] text-white/70 py-2.5 border-2 border-white/30 font-medium transition duration-500 cursor-pointer active:scale-95 font-mono">SEND</button>
                                        ) : (
                                            <button onClick={() => handleValidate(v.id)} className="flex-1 bg-[#212529] hover:bg-[#51565c] text-white/70 py-2.5 border-2 border-white/30 font-medium transition duration-500 cursor-pointer active:scale-95 font-mono">SEND</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {showModalBool && selectedFlag && isGuest && (
                            <ModalBool title="Payer un indice" label={`Confirmez-vous payer ${selectedFlag.hint_cost} coins pour voir l'indice ?`} btn1="Payer" btn2="Refuser" subtitle="Vous devez être connecté pour acheter les indices !" onSelect={(value) => { value === "Payer" ? showNotif("You must be logged in to purchase the clues !") : setShowModalBool(false) }} />
                        )}
                        {showModalBool && selectedFlag && !isGuest && (
                            <ModalBool title="Payer un indice" label={`Confirmez-vous payer ${selectedFlag.hint_cost} coins pour voir l'indice ?`} btn1="Payer" btn2="Refuser" subtitle="" onSelect={(value) => { if (value === "Payer") handleHint(selectedFlag.id); setShowModalBool(false) }} />
                        )}
                        {showModalText && selectedFlag && !isGuest && (
                            <ModalText title={`Indice | ${selectedFlag.title}`} label={selectedFlag.hint} btn="Fermer l'indice" onSelect={() => { setShowModalText(false); setSelectedFlag(null) }} />
                        )}
                    </div>
                </div>

                </div>

            </div>
        </div>
    )
}