"use client"

import { useNotif } from '@/components/NotifProvider'
import ModalBool from '@/components/ui/ModalBool'
import ModalText from '@/components/ui/ModalText'
import { useApi } from '@/hooks/useApi'
import { flags, geoint } from '@/lib/types'
import { useNavData } from '@/stores/store'
import { span } from 'framer-motion/client';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci'
import { FaLightbulb } from 'react-icons/fa'
import { IoWarningSharp } from 'react-icons/io5'
import { LuLightbulbOff } from 'react-icons/lu'

export default function Page() {
    const { showNotif } = useNotif()
    const { updateCoins, updatePoints, public_username } = useNavData()
    const { call } = useApi()

    const params = useParams();
    const router = useRouter();
    const [displayImage, setDisplayImage] = useState(-1)
    const [displayHint, setDisplayHint] = useState(false)

    const [geoint, setGeoint] = useState<geoint>()
    const [geointFlags, setGeointFlags] = useState<flags[]>([])
    const [currentFlags, setCurrentFlags] = useState<Record<number, string>>({})
    const [creatorName, setCreatorName] = useState("")

    const [showModalBool, setShowModalBool] = useState(false)
    const [showModalText, setShowModalText] = useState(false)
    const [selectedFlag, setSelectedFlag] = useState<flags | null>(null);

    const foundCount = geointFlags.filter(el => el.found).length;
    const flagsLen = geointFlags.length

    useEffect(() => {
        if (!params?.id) return;
        const getGeoint = async () => {
            const data = await call(`/api/challenges/${params.id}?type=geoint`)
            if (data.error) {
                router.refresh()
                router.push("/challenges")
                showNotif(data.error)
                return
            }
            if (!data.challenge) {
                router.refresh()
                router.push("/challenges")
                showNotif("Ce challenge n'existe pas / plus !")
                return
            }
            setGeoint(data.challenge)
            setGeointFlags(data.flags)
            setCreatorName(data.creator)
        }
        getGeoint()
    }, [params.id])

    const handleHint = async (id: number) => {
        id = Number(id)
        const flagObj = geointFlags.find(el => el.id === id);
        if (!flagObj) return;

        const data = await call(`/api/hint/?type=geoint`, { method: "POST", body: JSON.stringify({ challenge_id: params.id, flag_id: id }) }, ["Vous venez de déverouiller cet indice !", `-${flagObj.hint_cost} coins !`])
        setGeointFlags(prev => prev.map((el) => el.id === id ? { ...el, hint_show: true } : el))
        updateCoins(data.currentCoins)
        setShowModalBool(false);
        setShowModalText(true)
    }

    const handleValidate = async (id: number) => {
        const flagObj = geointFlags.find(el => el.id === id);
        if (!flagObj) return;

        const input = currentFlags[id] || "";

        if (!input || input === "") {
            showNotif("Veuillez saisir un flag !")
            return
        }

        if (input === `${geoint?.flag_format}{${flagObj.flag}}`) {
            const data = await call(`/api/flags/?type=geoint`, { method: "POST", body: JSON.stringify({ challenge_id: params.id, flag_id: id }) }, ["GG ! Vous venez de résoudre ce flag ", `+${flagObj.coins} coins !`]);

            setGeointFlags(prev =>
                prev.map(f =>
                    f.id === id ? { ...f, found: true } : f
                )
            );

            setCurrentFlags(prev => ({
                ...prev,
                [id]: ""
            }));

            updateCoins(Number(data.currentCoins))
            updatePoints(Number(data.currentPoint))

            if (data.challengeEnd) {
                updateCoins(Number(data?.currentCoins))
                updatePoints(Number(data?.currentPoint))
                showNotif("GG, vous venez de terminer le challenge !", "success")
                showNotif(`+${geoint?.coins} coins | +${geoint?.points} points !`, "success")
            }
        } else {
            showNotif("Eh non, pas pour cette fois !")
        }
    };

    return (
        <div className="flex flex-col bg-[#212529]">
            <div className="py-5 sm:py-15 px-4 bg-gray-800 flex flex-col items-center justify-center gap-5">
                {foundCount === flagsLen && (
                    <p className="w-fit px-4 py-2 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-3"><span className="text-green-600"><CiCircleCheck /></span>Vous avez terminé {geoint?.title} !</p>
                )}
                <div className='w-fit'>
                    <h2 className="text-white/60 text-xl sm:text-3xl italic text-center">Géoint - {geoint?.title} | Difficulté : {geoint?.difficulty}</h2>
                    <p className='text-center my-2 text-white/40'>Créé par : {creatorName !== "Inconnu" ? <Link className={"cursor-pointer hover:text-white/60 transition duration-500 italic"} href={`/user/${creatorName}`}>{creatorName}</Link> : <span className="cursor-pointer hover:text-white/60 transition duration-500 italic">Inconnu</span>} | {geoint?.created_at && new Date(geoint?.created_at).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    <hr className="w-full text-white my-3" />
                </div>
                <p className="text-center w-full sm:w-2/3 lg:w-1/2 text-white/40 text-sm sm:text-base leading-relaxed">{geoint?.description}</p>
                <div className='flex items-center gap-2'>
                    {geoint?.images?.map((v, k) => (
                        <img key={k} src={v} onClick={() => setDisplayImage(k)} alt="Image de départ" className="h-40 w-40 object-cover rounded-lg border border-white/10 cursor-pointer transition duration-500" />
                    ))}
                </div>
                <hr className="w-1/3 m-auto text-white my-5" />
                <p className="text-white/60">Votre progression : <span className={`font-semibold ${foundCount === flagsLen ? "text-green-600" : foundCount >= flagsLen / 2 ? "text-orange-500" : "text-red-600"}`}>{foundCount}</span> / {flagsLen}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {geointFlags.map((v, k) => (
                        <div key={k} className="w-full h-full min-h-65 bg-linear-to-br from-[#1e1e2f] to-[#181825] border border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col justify-around">
                            <div className='flex flex-col'>
                                <h2 className="text-xl font-semibold text-white">{v.title}</h2>
                                <p className="text-xs text-white/40 mb-4 mt-2">{v.description}</p>
                            </div>
                            <div className='flex flex-col'>
                                <div className="flex items-center gap-2 mb-4">
                                    {v.found ? (
                                        <div className="flex-1 relative">
                                            <input value={""} disabled type="text" placeholder="Vous avez déjà trouvé ce flag !" className="placeholder:text-green-500/60 w-full h-11 px-4 pr-10 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">🔎</span>
                                        </div>) : (
                                        <div className="flex-1 relative">
                                            <input value={currentFlags[v.id] || ""} onChange={(e) => setCurrentFlags(prev => ({ ...prev, [v.id]: e.target.value }))} type="text" placeholder={`${geoint?.flag_format}{${v.flag_format}}`} className="w-full h-11 px-4 pr-10 rounded-lg bg-[#2a2a3d] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">🔎</span>
                                        </div>
                                    )}
                                    {v.hint ? (
                                        <div>
                                            {v.hint_show ? (
                                                <button onClick={() => { setSelectedFlag(v); setShowModalText(true); }} className="h-11 w-11 flex items-center justify-center rounded-lg bg-[#2a2a3d] border border-gray-600 text-green-600 hover:text-green-700 hover:border-green-700 transition duration-500 cursor-pointer"><FaLightbulb /></button>
                                            ) : (
                                                <button onClick={() => { setSelectedFlag(v); setShowModalBool(true); }} className="h-11 w-11 flex items-center justify-center rounded-lg bg-[#2a2a3d] border border-gray-600 text-white hover:text-yellow-300 hover:border-yellow-400 transition duration-500 cursor-pointer"><FaLightbulb /></button>
                                            )}
                                        </div>
                                    ) : (
                                        <button onClick={() => showNotif("Aucun indice pour ce flag !")} className="h-11 w-11 flex items-center justify-center rounded-lg bg-[#2a2a3d] border border-gray-600 text-white hover:text-red-500 hover:border-red-500 transition duration-500 cursor-pointer"><LuLightbulbOff /></button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {v.found ? (
                                        <button onClick={() => showNotif("Vous avez déjà résolu ce flag !", "success")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-500 active:scale-95 cursor-pointer">Valider</button>
                                    ) : (
                                        <button onClick={() => handleValidate(v.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-500 cursor-pointer active:scale-95">Valider</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {showModalBool && selectedFlag && (
                        <ModalBool title="Payer un indice" label={`Confirmez-vous payer ${selectedFlag.hint_cost} coins pour voir l'indice ?`} btn1="Payer" btn2="Refuser" subtitle="" onSelect={(value) => { if (value === "Payer") handleHint(selectedFlag.id); setShowModalBool(false) }} />
                    )}
                    {showModalText && selectedFlag && (
                        <ModalText title={`Indice | ${selectedFlag.title}`} label={selectedFlag.hint} btn="Fermer l'indice" onSelect={() => { setShowModalText(false); setSelectedFlag(null) }} />
                    )}
                </div>
            </div>
        </div >
    )
}