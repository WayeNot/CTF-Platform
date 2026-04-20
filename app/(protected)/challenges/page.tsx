"use client";

import { useNotif } from "@/components/NotifProvider";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { categoryBtn, ctf, difficultyBtn, ctf_flags, flag_geoint, geoint, NewCtfFlag, difficulty, category } from "@/lib/types"
import { BiPlusCircle, BiPlusMedical } from "react-icons/bi";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import { BsArrowRightCircle } from "react-icons/bs";
import { staff_role } from "@/lib/config";
import { useSession } from "@/hooks/userSession";
import Link from "next/link";
import { FaFire } from "react-icons/fa";
import { useApi } from "@/hooks/useApi";

export default function Home() {
    const { showNotif } = useNotif()
    const { userSession } = useSession()
    const { call } = useApi()

    const router = useRouter();

    const [ctf, setCtf] = useState<ctf[]>([])

    const [addCtf, setAddCtf] = useState(false)
    const [ctfBuilder, setCtfBuilder] = useState<{
        title: string
        description: string
        difficulty: difficulty | ""
        category: category[]
        flag_format: string
        files: File[]
    }>({title: "", description: "", difficulty: "", category: [], flag_format: "", files: []})

    const [settingsCtfBuilder, setSettingsCtfBuilder] = useState({ displayDifficulty: false, displayCategory: false, displayMaxAttempt: false, displayCreateFlags: false, displayInsertFile: false })

    const [ctfFlag, setCtfFlag] = useState<NewCtfFlag[]>([])
    const [ctfNewFlag, setCtfNewFlag] = useState<NewCtfFlag>({ title: "", description: "", flag: "", format: "", hint: "", hint_cost: undefined })

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // --------- Séparation ctf / Géoint

    const [geoint, setGeoint] = useState<geoint[]>([])

    const [addGeoint, setAddGeoint] = useState(false)
    const [geointBuilder, setGeointBuilder] = useState({ title: "", description: "", difficulty: "", image: "", flag: "", hint: "", points: 0 })
    const [settingsGeointBuilder, setSettingsGeointBuilder] = useState({ displayDifficulty: false })

    const [panelTab, setPanelTab] = useState(0)

    const toggleDifficulty = () => {
        setSettingsCtfBuilder(prev => ({
            ...prev,
            displayDifficulty: !prev.displayDifficulty
        }));
    };

    const toggleCategory = () => {
        setSettingsCtfBuilder(prev => ({
            ...prev,
            displayCategory: !prev.displayCategory
        }));
    };

    useEffect(() => {
        const getChallenges = async () => {
            const data = await call(`/api/challenges?type=${panelTab === 0 ? "ctf" : "geoint"}`)
            { panelTab === 0 ? setCtf(data) : setGeoint(data) }
        }
        getChallenges()
    }, [panelTab])

    const geointToggleDifficulty = () => {
        setSettingsGeointBuilder(prev => ({
            ...prev,
            displayDifficulty: !prev.displayDifficulty
        }));
    };

    const resetForms = () => {
        setAddCtf(false)
        setAddGeoint(false)
        setGeointBuilder({ title: "", description: "", difficulty: "", image: "", flag: "", hint: "", points: 0 })
        setSettingsCtfBuilder({ ...settingsCtfBuilder, displayMaxAttempt: false });
        setCtfBuilder({ title: "", description: "", difficulty: "", category: [], flag_format: "", files: [] })
        setCtfFlag([])
        setCtfNewFlag({ title: "", description: "", flag: "", format: "", hint: "", hint_cost: undefined })
    }

    const handleCreate = async () => {
        const formData = new FormData();

        formData.append("type", panelTab === 0 ? "ctf" : "geoint");

        formData.append("name", ctfBuilder.title);
        formData.append("description", ctfBuilder.description);
        formData.append("difficulty", ctfBuilder.difficulty);
        formData.append("category", JSON.stringify([ctfBuilder.category]));
        formData.append("flag_format", ctfBuilder.flag_format);

        selectedFiles.forEach(file => {
            formData.append("files", file);
        });

        formData.append("flags", JSON.stringify(ctfFlag))

        if (panelTab === 0) {
            Object.entries(ctfBuilder).forEach(([key, value]) => {
                if (key !== "files") formData.append(key, value as any);
            });

            selectedFiles.forEach(file => {
                formData.append("files", file);
            });
        } else {
            formData.append("data", JSON.stringify(geointBuilder));
        }

        await fetch(`/api/challenges?type=${panelTab === 0 ? "ctf" : "geoint"}`, {
            method: "POST",
            body: formData,
        });
        resetForms()
    };

    const easyGeoint = geoint?.filter(el => el.difficulty === "Facile")
    const intermediaireGeoint = geoint?.filter(el => el.difficulty === "Intermédiaire")
    const advancedGeoint = geoint?.filter(el => el.difficulty === "Avancé")
    const expertGeoint = geoint?.filter(el => el.difficulty === "Expert")

    return (
        <div>
            <div className="flex items-center gap-5 m-8">
                <button onClick={() => setPanelTab(0)} className={`${panelTab === 0 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 transition cursor-pointer duration-500 bg-[#2a2a3d]`}>🚩 Nos CTF</button>
                <button onClick={() => setPanelTab(1)} className={`${panelTab === 1 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 transition cursor-pointer duration-500 bg-[#2a2a3d]`}>📍 GEOINT</button>
            </div>
            {panelTab === 0 && (
                <div>
                    {userSession?.role && staff_role.includes(userSession.role) && (
                        <button onClick={() => setAddCtf(true)} className="p-4 m-8 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center flex items-center justify-center gap-2 font-bold"><BiPlusCircle />Créer un CTF</button>
                    )}
                    <div className="flex items-center gap-3 m-8">
                        {ctf.map((v, k) => (
                            <button key={k} onClick={() => { router.refresh(); router.push(`/challenges/ctf/${v.id}`) }} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                        ))}
                    </div>
                    {addCtf && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="flex gap-5 w-full max-w-5xl">
                                <div className="w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6">
                                    <div className="flex flex-col gap-3 text-white/40 text-center">
                                        <h2 className="text-xl font-bold text-white">Création d'un CTF</h2>
                                        <p className="text-gray-300 text-[17px] leading-relaxed">Créer un CTF dynamiquement juste ici !</p>
                                    </div>
                                    <hr className="text-white/40 my-5 m-auto" />
                                    <div className="flex items-center flex-col gap-3">
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={ctfBuilder.title} onChange={(e) => setCtfBuilder({ ...ctfBuilder, title: e.target.value })} className={`border-2 ${ctfBuilder.title ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-1/2 text-white/80 p-1.5`} type="text" placeholder="Nom du CTF" />
                                            <input value={ctfBuilder.description} onChange={(e) => setCtfBuilder({ ...ctfBuilder, description: e.target.value })} className={`border-2 ${ctfBuilder.description ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-1/2 text-white/80 p-1.5`} type="text" placeholder="Description du CTF" />
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="w-1/2">
                                                    <button onClick={toggleDifficulty} className={`${ctfBuilder.difficulty ? "border-green-700/40" : "border-red-500/40"} flex items-center justify-center gap-2 border-2 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]`}>{ctfBuilder.difficulty ? `Difficulté : ( ${ctfBuilder.difficulty} )` : "Difficulté"} {settingsCtfBuilder.displayDifficulty ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}</button>
                                                    {settingsCtfBuilder.displayDifficulty && (
                                                        <div className="flex items-center justify-center gap-2 flex-wrap w-full mt-2">
                                                            {difficultyBtn.map((el) => (
                                                                <button key={el.name} onClick={() => { setCtfBuilder({ ...ctfBuilder, difficulty: el.name as difficulty }); setSettingsCtfBuilder({ ...settingsCtfBuilder, displayDifficulty: false }) }} className="text-white/40 bg-[#2a2a3d] rounded-xl w-fit p-2 cursor-pointer hover:bg-[#2a2a3d]/60 transition duration-500"><span className={el.color}>{el.name}</span></button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-1/2">
                                                    <button onClick={toggleCategory} className={`${ctfBuilder.category ? "border-green-700/40" : "border-red-500/40"} flex items-center justify-center gap-2 border-2 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]`}>{ctfBuilder.category ? `Catégorie : ( ${ctfBuilder.category} )` : "Catégorie"} {settingsCtfBuilder.displayCategory ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}</button>
                                                    {settingsCtfBuilder.displayCategory && (
                                                        <div className="flex items-center justify-center gap-2 flex-wrap w-full mt-2">
                                                            {categoryBtn.map((el) => (
                                                                <button key={el.name} onClick={() => { setCtfBuilder({ ...ctfBuilder, category: [...ctfBuilder.category, el.name as category] }); setSettingsCtfBuilder({ ...settingsCtfBuilder, displayCategory: false }) }} className="text-white/40 bg-[#2a2a3d] rounded-xl w-fit p-2 cursor-pointer hover:bg-[#2a2a3d]/60 transition duration-500"><span className={el.color}>{el.name}</span></button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={ctfBuilder.flag_format} onChange={(e) => setCtfBuilder({ ...ctfBuilder, flag_format: e.target.value })} className={`border-2 ${ctfBuilder.flag_format ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-1/2 text-white/80 p-1.5`} type="text" placeholder="Format du flag" />
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <button onClick={() => setSettingsCtfBuilder({ ...settingsCtfBuilder, displayInsertFile: true })} className="flex items-center justify-center gap-2 border-2 border-white/40 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]">Gestion des dossiers<BsArrowRightCircle /></button>
                                            <button onClick={() => setSettingsCtfBuilder({ ...settingsCtfBuilder, displayCreateFlags: true })} className="flex items-center justify-center gap-2 border-2 border-white/40 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]">Création des flags<BsArrowRightCircle /></button>
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-2/3 flex items-center gap-2">
                                            <button onClick={() => resetForms()} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-red-700 cursor-pointer transition duration-500">Annuler</button>
                                            {(!ctfBuilder.title || !ctfBuilder.description || !ctfBuilder.difficulty || !ctfBuilder.category || !ctfBuilder.flag_format) ? (
                                                <button className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 bg-red-800 hover:bg-red-600 transition duration-500 cursor-not-allowed">Créer</button>
                                            ) : (
                                                <button onClick={() => handleCreate()} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-green-700 cursor-pointer transition duration-500">Créer</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 max-h-150 overflow-y-auto">
                                    <h2 className="text-xl font-bold text-white text-center">Aperçu du CTF</h2>
                                    <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                    <div className="text-white/70 flex flex-col gap-3">
                                        <p><span className="text-white font-bold">Nom :</span> {ctfBuilder.title || "N/A"}</p>
                                        <p><span className="text-white font-bold">Description :</span> {ctfBuilder.description || "N/A"}</p>
                                        <p><span className="text-white font-bold">Difficulté :</span> {ctfBuilder.difficulty || "N/A"}</p>
                                        <p><span className="text-white font-bold">Catégorie :</span> {ctfBuilder.category || "N/A"}</p>
                                        <p><span className="text-white font-bold">Format :</span>{ctfBuilder.flag_format || "N/A"}</p>
                                        <p><span className="text-white font-bold">Énoncé :</span></p>
                                        <div>
                                            <span className="text-white font-bold">Fichier :</span>
                                            {selectedFiles.length > 0 && (
                                                <div className="text-white/40 text-sm">
                                                    {selectedFiles.map((f) => (
                                                        <p key={f.name}>📄 {f.name}</p>
                                                    ))}
                                                </div>
                                            ) || "Aucun"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {settingsCtfBuilder.displayInsertFile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3 w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                                <h2 className="text-xl font-bold text-white">Ajouter / Supprimer des dossiers / fichiers</h2>
                                <hr className="text-white/40 my-3 w-1/2 m-auto" />
                                <input type="file" onChange={(e) => { const files = Array.from(e.target.files || []); setSelectedFiles(files) }} className="border-2 border-white/40 rounded-lg w-2/3 text-white/80 p-1.5 text-center" />
                                {selectedFiles.length > 0 && (
                                    <div className="text-white/40 text-sm">
                                        {selectedFiles.map((f) => (
                                            <p key={f.name}>📄 {f.name}</p>
                                        ))}
                                    </div>
                                )}
                                <div className="w-2/3 flex items-center gap-2">
                                    <button onClick={() => setSettingsCtfBuilder({ ...settingsCtfBuilder, displayInsertFile: false })} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-red-700 cursor-pointer transition duration-500">Annuler</button>
                                    <button onClick={() => setSettingsCtfBuilder({ ...settingsCtfBuilder, displayInsertFile: false })} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-green-700 cursor-pointer transition duration-500">Valider</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {settingsCtfBuilder.displayCreateFlags && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="flex gap-5 w-full max-w-4xl max-h-87.5">
                                <div className="flex flex-col items-center gap-3 w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6">
                                    <h2 className="text-xl font-bold text-white">Création des flags</h2>
                                    <hr className="text-white/40 my-3 w-1/2 m-auto" />

                                    <div className="w-full flex items-center gap-2">
                                        <input value={ctfNewFlag.title} onChange={(e) => setCtfNewFlag({ ...ctfNewFlag, title: e.target.value })} type="text" placeholder="Titre du flag" className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5" />
                                        <input value={ctfNewFlag.description} onChange={(e) => setCtfNewFlag({ ...ctfNewFlag, description: e.target.value })} type="text" placeholder="Description du flag" className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5" />
                                    </div>
                                    <div className="w-full flex items-center gap-2">
                                        <input value={ctfNewFlag.format} onChange={(e) => setCtfNewFlag({ ...ctfNewFlag, format: e.target.value })} type="text" placeholder="Format du flag" className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5" />
                                        <input value={ctfNewFlag.flag} onChange={(e) => setCtfNewFlag({ ...ctfNewFlag, flag: e.target.value })} type="text" placeholder="Flag a trouver" className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5" />
                                    </div>
                                    <div className="w-full flex items-center gap-2">
                                        <input value={ctfNewFlag.hint} onChange={(e) => setCtfNewFlag({ ...ctfNewFlag, hint: e.target.value })} type="text" placeholder="hint ( rien par défaut ! )" className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5" />
                                        <input value={ctfNewFlag.hint_cost} onChange={(e) => setCtfNewFlag({ ...ctfNewFlag, hint_cost: Number(e.target.value) })} type="number" placeholder="🪙 - Cout de l'hint" className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5" />
                                    </div>
                                    <div className="w-full flex items-center gap-2 my-5">
                                        <button onClick={() => { setCtfNewFlag({ title: "", description: "", flag: "", format: "", hint: "", hint_cost: undefined }); setSettingsCtfBuilder({ ...settingsCtfBuilder, displayCreateFlags: false }) }} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-red-700 transition duration-500 cursor-pointer">Retour</button>
                                        {(!ctfNewFlag.title || !ctfNewFlag.description || !ctfNewFlag.flag) ? (
                                            <button className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 bg-red-800 hover:bg-red-600 transition duration-500 cursor-not-allowed">Ajouter</button>
                                        ) : (
                                            <button onClick={() => { setCtfFlag(prev => [...prev, ctfNewFlag]); setCtfNewFlag({ title: "", description: "", flag: "", format: "", hint: "", hint_cost: undefined }) }} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 bg-green-800 hover:bg-green-600 transition duration-500 cursor-pointer">Ajouter</button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 overflow-y-auto">
                                    <h2 className="text-xl font-bold text-white text-center">Liste des flags</h2>
                                    <hr className="text-white/40 my-3 w-1/2 m-auto" />
                                    {ctfFlag.length === 0 ? (
                                        <h2 className="bg-[#2a2a3d] w-full p-2 rounded-lg text-white/40">Aucun flag pour le moment !</h2>
                                    ) : (
                                        <div className="w-full flex flex-col items-center gap-2">
                                            {ctfFlag.map((el) => (
                                                <p key={el.title} className="bg-[#2a2a3d] w-full p-2 rounded-lg text-white/40 flex items-center gap-2"><BiPlusMedical />Titre : {el.title} | Flag : {el.flag}</p>
                                            ))}
                                        </div>
                                    )}
                                    { }
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            )}
            {panelTab === 1 && (
                <div>
                    {userSession?.role && "guest".includes(userSession.role) && (
                        <div className="mt-20 absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                            <div className="w-fit max-w-fit bg-[#1e1e2f] rounded-2xl shadow-2xl p-6 animate-fadeIn">
                                <Link href="/accounts/login" className="inset-0 flex items-center justify-center gap-3 text-white/40 p-4 rounded-lg w-full border border-orange-600 text-[20px] text-center cursor-pointer hover:text-white/20 transition duration-500"><FaFire className="text-orange-500" /> Connectez-vous pour sauvegarder votre progression<FaFire className="text-orange-500" /></Link>
                            </div>
                        </div>
                    )}
                    {userSession?.role && staff_role.includes(userSession.role) && (
                        <button onClick={() => setAddGeoint(true)} className="p-4 m-8 border border-gray-600 text-white/40 rounded-[7px] max-w-2/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center flex items-center justify-center gap-2 font-bold"><BiPlusCircle />Créer un Géoint</button>
                    )}
                    {!geoint && (
                        <h2 className="text-white/70 text-xl sm:text-7xl mt-30 font-mono text-center">Aucun Geoint pour le moment !</h2>
                    )}
                    <div className="flex flex-col gap-6 m-8">
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="text-white/50">Difficulté : <span className="font-bold text-white/40">Facile</span></h2>
                            {!easyGeoint || easyGeoint.length === 0 ? (
                                <h2 className="p-4 border border-gray-600 text-center text-red-500/40 rounded-[7px] w-fit transition duration-500">Aucun challenge GEOINT difficulté Facile pour le moment !</h2>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {easyGeoint.map((v, k) => (
                                        <button key={k} onClick={() => { router.refresh(); router.push(`/challenges/geoint/${v.id}`) }} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="text-white/50">Difficulté : <span className="font-bold text-white/40">Intermédiaire</span></h2>
                            {!intermediaireGeoint || intermediaireGeoint.length === 0 ? (
                                <h2 className="p-4 border border-gray-600 text-center text-red-500/40 rounded-[7px] w-fit transition duration-500">Aucun challenge GEOINT difficulté Intermédiaire pour le moment !</h2>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {intermediaireGeoint.map((v, k) => (
                                        <button key={k} onClick={() => { router.refresh(); router.push(`/challenges/geoint/${v.id}`) }} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="text-white/50">Difficulté : <span className="font-bold text-white/40">Avancé</span></h2>
                            {!advancedGeoint || advancedGeoint.length === 0 ? (
                                <h2 className="p-4 border border-gray-600 text-center text-red-500/40 rounded-[7px] w-fit transition duration-500">Aucun challenge GEOINT difficulté Avancé pour le moment !</h2>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {advancedGeoint.map((v, k) => (
                                        <button key={k} onClick={() => { router.refresh(); router.push(`/challenges/geoint/${v.id}`) }} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="text-white/50">Difficulté : <span className="font-bold text-white/40">Expert</span></h2>
                            {!expertGeoint || expertGeoint.length === 0 ? (
                                <h2 className="p-4 border border-gray-600 text-center text-red-500/40 rounded-[7px] w-fit transition duration-500">Aucun challenge GEOINT difficulté Expert pour le moment !</h2>
                            ) : (
                                <div className="flex items-center gap-5">
                                    {expertGeoint.map((v, k) => (
                                        <button key={k} onClick={() => { router.refresh(); router.push(`/challenges/geoint/${v.id}`) }} className="p-4 border border-gray-600 text-white/40 rounded-[7px] w-1/10 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">{v.title}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {addGeoint && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <div className="flex gap-5 w-full max-w-5xl">
                                <div className="w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6">
                                    <div className="flex flex-col gap-3 text-white/40 text-center">
                                        <h2 className="text-xl font-bold text-white">Création d'un Geoint</h2>
                                        <p className="text-gray-300 text-[17px] leading-relaxed">Créer un Geoint dynamiquement juste ici !</p>
                                    </div>
                                    <hr className="text-white/40 my-5 m-auto" />
                                    <div className="flex items-center flex-col gap-3">
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={geointBuilder.title} onChange={(e) => setGeointBuilder({ ...geointBuilder, title: e.target.value })} className={`border-2 ${geointBuilder.title ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-1/2 text-white/80 p-1.5`} type="text" placeholder="Nom du challenge" />
                                            <input value={geointBuilder.flag} onChange={(e) => setGeointBuilder({ ...geointBuilder, flag: e.target.value })} className={`border-2 ${geointBuilder.flag ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-1/2 text-white/80 p-1.5`} type="text" placeholder="Le flag" />
                                        </div>
                                        <textarea value={geointBuilder.description} onChange={(e) => setGeointBuilder({ ...geointBuilder, description: e.target.value })} className={`border-2 ${geointBuilder.description ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-full text-white/80 p-1.5`} placeholder="Description du challenge" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <input value={geointBuilder.hint} onChange={(e) => setGeointBuilder({ ...geointBuilder, hint: e.target.value })} className={`border-2 ${geointBuilder.hint ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-1/2 text-white/80 p-1.5`} type="text" placeholder="Text de l'hint" />
                                            <input value={geointBuilder.points} onChange={(e) => setGeointBuilder({ ...geointBuilder, points: Number(e.target.value) })} className={`border-2 ${geointBuilder.points ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-1/2 text-white/80 p-1.5`} type="number" placeholder="Point a remporter" />
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-full flex items-center gap-2 justify-between">
                                            <div className="flex items-start gap-2 justify-between w-full">
                                                <div className="w-1/2 relative min-h-10">
                                                    <button onClick={geointToggleDifficulty} className={`${geointBuilder.difficulty ? "border-green-700/40" : "border-red-500/40"} flex items-center justify-center gap-2 border-2 rounded-lg w-full text-white/80 p-1.5 transition duration-500 cursor-pointer hover:text-white/60 hover:border-white/20 text-[13px]`}>{geointBuilder.difficulty ? `Difficulté : ( ${geointBuilder.difficulty} )` : "Difficulté"} {settingsGeointBuilder.displayDifficulty ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}</button>
                                                    {settingsGeointBuilder.displayDifficulty && (
                                                        <div className="absolute left-0 top-full mt-2 w-full bg-[#1e1e2f] rounded-lg p-2 flex flex-wrap gap-2 z-50 shadow-lg">
                                                            {difficultyBtn.map((el) => (
                                                                <button key={el.name} onClick={() => { setGeointBuilder({ ...geointBuilder, difficulty: el.name }); setSettingsGeointBuilder({ ...settingsGeointBuilder, displayDifficulty: false }) }} className="text-white/40 bg-[#2a2a3d] rounded-xl w-fit p-2 cursor-pointer hover:bg-[#2a2a3d]/60 transition duration-500"><span className={el.color}>{el.name}</span></button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <input value={geointBuilder.image} onChange={(e) => setGeointBuilder({ ...geointBuilder, image: e.target.value })} className={`border-2 ${geointBuilder.image ? "border-green-700/40" : "border-red-500/40"} rounded-lg w-full text-white/80 p-1.5`} type="text" placeholder="Image de départ" />
                                                    <img className="w-18.75 rounded-lg" src={geointBuilder.image || "https://img.freepik.com/vecteurs-libre/bientot-arriere-plan-conception-effet-lumiere-mise-au-point_1017-27277.jpg?semt=ais_hybrid&w=740&q=80"} alt="Image de départ" />
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                        <div className="w-2/3 flex items-center gap-2">
                                            <button onClick={() => resetForms()} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-red-700 cursor-pointer transition duration-500">Annuler</button>
                                            {(!geointBuilder.title || !geointBuilder.description || !geointBuilder.flag || !geointBuilder.difficulty) ? (
                                                <button className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 bg-red-800 hover:bg-red-600 transition duration-500 cursor-not-allowed">Ajouter</button>
                                            ) : (
                                                <button onClick={() => handleCreate()} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-green-700 cursor-pointer transition duration-500">Ajouter</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 max-h-150 overflow-y-auto">
                                    <h2 className="text-xl font-bold text-white text-center">Aperçu du CTF</h2>
                                    <hr className="text-white/40 my-5 w-1/2 m-auto" />
                                    <div className="text-white/70 flex flex-col gap-3">
                                        <p><span className="text-white font-bold">Nom :</span> {geointBuilder.title || "N/A"}</p>
                                        <p><span className="text-white font-bold">Flag :</span> {geointBuilder.flag || "N/A"}</p>
                                        <p><span className="text-white font-bold">Description :</span><br /> <span className="text-white/50 text-sm">{geointBuilder.description || "Aucune description"}</span></p>
                                        <p><span className="text-white font-bold">Difficulté :</span> {geointBuilder.difficulty || "N/A"}</p>
                                        <p className="text-white font-bold">Image de départ :</p>
                                        <img className="w-18.75 rounded-lg" src={geointBuilder.image || "https://img.freepik.com/vecteurs-libre/bientot-arriere-plan-conception-effet-lumiere-mise-au-point_1017-27277.jpg?semt=ais_hybrid&w=740&q=80"} alt="Image de départ" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}