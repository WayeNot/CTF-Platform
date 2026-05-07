"use client"

import { useEffect, useState } from "react"
import { useNotif } from "./NotifProvider"
import { Permissions, Roles, User } from "@/lib/types"
import { IoIosArrowDroprightCircle, IoMdCheckboxOutline, IoMdPersonAdd } from "react-icons/io"
import { MdAlternateEmail, MdCheckBoxOutlineBlank } from "react-icons/md"
import InputNumber from "./ModalInput"
import { coinManagement, default_pp, statusColor } from "@/lib/config"
import Link from "next/link"
import { TbCoinRupeeFilled } from "react-icons/tb"
import { LuCalendar1 } from "react-icons/lu"
import { useApi } from "@/hooks/useApi"
import { useNavData } from "@/stores/store"
import { LiaCriticalRole } from "react-icons/lia"

export default function AdminPanel({ closePanel }: { closePanel: () => void }) {
    const { showNotif } = useNotif()
    const { call } = useApi()

    const { coins, updateCoins } = useNavData()

    const [panelTab, setPanelTab] = useState("")

    const [users, setUsers] = useState<User[]>([])
    const [editUser, setEditUser] = useState(-1)

    const [inMaintenance, setInMaintenance] = useState(false)
    const [roles, setRoles] = useState<Roles[]>([])
    // const [permissions, setPermissions] = useState<Permissions[]>([])

    const [displayCreation, setDisplayCreation] = useState(-1)
    const [newRole, setNewRole] = useState({ label: "", description: "", allPerms: [] })
    const [newPermission, setNewPermission] = useState({ label: "", description: "" })

    const [showModal, setShowModal] = useState<null | "set" | "reset">(null)
    const [panelUser, setPanelUser] = useState(0)

    const [permissions, setPermissions] = useState([[
        { id: 0, name: "Permissions générales", description: "", isSelected: false, canBeSelected: false },
        { id: 1, name: "Test", description: "", isSelected: false, canBeSelected: true },
        { id: 2, name: "Test", description: "", isSelected: false, canBeSelected: true },
        { id: 3, name: "Test", description: "", isSelected: false, canBeSelected: true },
        { id: 4, name: "Test", description: "", isSelected: false, canBeSelected: true },
    ], [
        { id: 5, name: "Permissions des membres", description: "", isSelected: false, canBeSelected: false },
        { id: 6, name: "Test", description: "", isSelected: false, canBeSelected: true },
        { id: 7, name: "Test", description: "", isSelected: false, canBeSelected: true },
        { id: 8, name: "Test", description: "", isSelected: false, canBeSelected: true },
        { id: 9, name: "Test", description: "", isSelected: false, canBeSelected: true },
    ]])

    const colorClasses = {
        red: "bg-red-500/40",
        orange: "bg-orange-500/40",
        amber: "bg-amber-500/40",
        yellow: "bg-yellow-300/40",
        lime: "bg-lime-500/40",
        green: "bg-green-500/40",
        emerald: "bg-emerald-500/40",
        teal: "bg-teal-500/40",
        cyan: "bg-cyan-500/40",
        sky: "bg-sky-500/40",
        blue: "bg-blue-500/40",
        indigo: "bg-indigo-500/40",
        violet: "bg-violet-500/40",
        purple: "bg-purple-500/40",
        fuchsia: "bg-fuchsia-500/40",
        pink: "bg-pink-500/40",
        rose: "bg-rose-500/40",
        slate: "bg-slate-500/40",
        gray: "bg-gray-500/40",
        zinc: "bg-zinc-500/40",
        neutral: "bg-neutral-500/40",
        stone: "bg-stone-500/40"
    }

    const colorRole: (keyof typeof colorClasses)[] = [
        "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal"
    ]

    const [selectedColor, setSelectedColor] = useState("")

    const getAllUser = async () => {
        const req = await fetch("/api/users")
        if (!req.ok) {
            const err = await req.json()
            showNotif(err.error)
            return
        }
        setUsers(await req.json())
    }

    const getMaintenance = async () => {
        const data = await call("/api/admin/maintenance")
        setInMaintenance(data)
    }

    // const getAllRoles = async () => {
    //     setRoles(await call("/api/roles/roles"));
    //     setPermissions(await call("/api/roles/permissions"));
    // }

    useEffect(() => {
        if (panelTab === "Gestion des utilisateurs") {
            getAllUser()
        }
        // if (panelTab === "Gestion des rôles") {
        //     getAllRoles()
        // }
        if (panelTab === "Logs & Sécurité") {
            getMaintenance()
        }
    }, [panelTab])

    const setMaintenance = async () => {
        await call("/api/admin/maintenance", { method: "PATCH", body: JSON.stringify({ inMaintenance: !inMaintenance }) }, [inMaintenance ? "Maintenance terminée avec succès !" : "Maintenance activée avec succès !"])
        setInMaintenance(!inMaintenance)
    }

    const updateCoin = async (value: number, reason: string) => {
        const data = await call(`/api/users/${editUser}/coin/`, { method: "PATCH", body: JSON.stringify({ operation: `${value < 0 ? "remove_coins" : "add_coins"}`, value: Math.abs(value), reason: reason || "" }) }, ["Nombre de coins bien mis à jour !"])
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coins: data.newSold } : user))
        setShowModal(null)
        updateCoins(data.newSold)
    }

    const setCoins = async (value: any, reason: string = "") => {
        if (typeof value === "string") value = value.trim()

        if (value === "" || value === "+" || value === "-") {
            showNotif("Veuillez saisir un nombre valide !")
            return
        }

        const num = Number(value)

        if (isNaN(num)) {
            showNotif("Veuillez saisir un nombre valide !")
            return
        }
        setShowModal(null)
        const data = await call(`/api/users/${editUser}/coin`, { method: "PATCH", body: JSON.stringify({ operation: "set_coins", value: Math.abs(num), reason: reason || "" }) }, ["Nombre de coins set avec succès !"])
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coins: data.newSold } : user))
        updateCoins(data.newSold)
    }

    const resetCoins = async (reason: string = "") => {
        await call(`/api/users/${editUser}/coin`, { method: "PATCH", body: JSON.stringify({ operation: "reset_coins", value: 0, reason: reason || "" }) }, ["Nombre de coins reset avec succès !"])
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coins: 0 } : user))
        setShowModal(null)
        updateCoins(0)
    }

    const handleCreateRole = () => {
        if (!newRole || !newRole.label || !newRole.description || newRole.allPerms.length === 0) {
            showNotif("Veuillez remplir tout les champs !")
            return
        }
    }

    const panelTabLabel = ["Dashboard", "Gestion des utilisateurs", "Gestion des rôles", "Gestion des CTF", "Gestion des challenges", "Soumission des flags", "ScoreBoard", "Gestion des annonces", "Paramètres", "Logs & Sécurité"]

    return (
        <div id="overlay" className="fixed inset-0 z-50 flex items-center justify-center gap-15 bg-black/70 backdrop-blur-sm">
            <div className="w-fit h-3/4 bg-[#212529] border border-red-500/60 shadow-2xl p-6 animate-fadeIn">
                <div className="flex justify-center gap-5 max-h-[50vh] overflow-y-auto pr-2 text-center text-white/70">
                    <h2 className="text-white/70 text-[25px] font-mono font-bold">ADMIN PANEL - FlagCore</h2>
                    <button onClick={closePanel} className="text-gray-400 hover:text-white text-[25px] cursor-pointer transition duration-500">✕</button>
                </div>
                <hr className="my-5 border-white/30" />
                <div className="flex justify-between items-center mb-4 gap-3">
                    <div className="flex items-center justify-center gap-3">
                        {panelTabLabel.map((v, k) => (
                            <button key={k} onClick={() => setPanelTab(v)} className={`${panelTab === v ? "text-red-500" : "text-white/40"} font-mono px-2 text-[15px] py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#212529]`}>{v}</button>
                        ))}
                    </div>
                </div>
                {panelTab === "Gestion des utilisateurs" && (
                    <div className="w-full">
                        <div className="flex items-center gap-3 w-full">
                            {Array.isArray(users) && users.map((el) => (
                                <div onClick={() => setEditUser(el.user_id)} key={el.user_id} className="border border-gray-600 text-white/40 w-1/10 py-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer">
                                    <p className="text-center">{el.user_id} | {el.username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {panelTab === "Logs & Sécurité" && (
                    <div>
                        {inMaintenance ? (
                            <button onClick={() => setMaintenance()} className="flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center"><IoMdCheckboxOutline />Terminer la maintenance</button>
                        ) : (
                            <button onClick={() => setMaintenance()} className="flex items-center gap-3 text-red-500 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center"><MdCheckBoxOutlineBlank />Mettre le site en maintenance</button>
                        )}
                    </div>
                )}
                {editUser !== -1 && (
                    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                        <div className="bg-[#1e1e2f] rounded-2xl shadow-2xl p-5 w-fit animate-fadeIn relative">
                            <div className="w-full flex items-center justify-between gap-5 mb-5">
                                <div className="flex items-center justify-center gap-5 w-full">
                                    <button onClick={() => setPanelUser(0)} className={`${panelUser === 0 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Informations</button>
                                    <button onClick={() => setPanelUser(1)} className={`${panelUser === 1 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des coins</button>
                                    <button onClick={() => setPanelUser(2)} className={`${panelUser === 2 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des rôles</button>
                                    <button onClick={() => setPanelUser(3)} className={`${panelUser === 3 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion de la progression</button>
                                    <button onClick={() => setPanelUser(4)} className={`${panelUser === 4 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Monitoring / débug</button>
                                </div>
                                <button onClick={() => setEditUser(-1)} className="text-gray-400 hover:text-white text-lg cursor-pointer transition duration-500">✕</button>
                            </div>
                            {panelUser === 0 && (
                                <div>
                                    {users.filter(el => el.user_id === editUser).map(el => (
                                        <div key={el.user_id} className="flex flex-col gap-5 text-white">
                                            <div className="flex items-center gap-5">
                                                <img src={el.pp_url || default_pp} alt="Logo de l'utilisateur" className={`w-20 rounded-[25%] bg-center bg-cover bg-no-repeat ${statusColor[el.status] || ""}`} />
                                                <Link href={`/user/${el.user_id}`} className="font-bold w-fit text-[25px] text-orange-400 transition duration-500 hover:text-orange-500">{el.user_id} | {el.username} - ( {el.role} )</Link>
                                            </div>
                                            <p className="flex items-center gap-2">Actuellement connecté ?<span className={el.is_online ? "text-green-500" : "text-red-500"}>{el.is_online ? "En ligne" : "Hors ligne"}</span></p>
                                            <Link href={`mailto:${el.email}`} className="flex items-center gap-2 font-bold italic w-fit text-[20px] text-orange-400 transition duration-500 hover:text-orange-500"><MdAlternateEmail className="text-[25px]" /> - {el.email}</Link>
                                            <p className="flex items-center gap-2 font-bold w-fit text-[25px] text-orange-400 transition duration-500 hover:text-orange-500 cursor-pointer"><LuCalendar1 /> - {new Date(el.created_at).toLocaleString()}</p>
                                            <p onClick={() => setPanelUser(1)} className="flex items-center gap-2 font-bold w-fit text-[25px] text-orange-400 transition duration-500 hover:text-orange-500 cursor-pointer"><TbCoinRupeeFilled /> - {el.coins || 0}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {panelUser === 1 && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-white/40 text-[20px] font-bold w-fit">Ajout / Retrait de coins : </h2>
                                        <div className="flex items-center gap-3 w-auto">
                                            {coinManagement.map((v, k) => (
                                                <button key={k} onClick={() => updateCoin(Number(v), "")} className="w-fit text-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer">{v}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-full flex items-center">
                                        <button onClick={() => setShowModal("set")} className="flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Modifier le nombre de coins</button>
                                        <button onClick={() => setShowModal("reset")} className="flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Reset le nombre de coins</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {panelTab === "Gestion des rôles" && (
                    <div className="flex flex-col gap-5 mt-5">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setDisplayCreation(1)} className="border border-gray-600 text-white/40 w-fit p-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Créer un rôle</button>
                            <button className="border border-gray-600 text-white/40 w-fit p-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Créer une permission</button>
                        </div>
                        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30"><span className="h-px w-6 bg-white/20" />Rôles ↓<span className="h-px flex-1 bg-white/10" /></div>
                        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30"><span className="h-px w-6 bg-white/20" />Permissions ↓<span className="h-px flex-1 bg-white/10" /></div>
                    </div>
                )}
                                {displayCreation === 1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn">
                        <div className="flex w-full max-w-6xl gap-4">
                            <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                                <div className="relative flex flex-col items-center text-center px-8 py-9 w-full">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><LiaCriticalRole /></div>
                                    <div className="flex items-center flex-col gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">Création d'un rôle</h2>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-65">Créer n'importe quel rôle grâce à notre configurateur !</p>
                                    </div>
                                    <div className="w-2/3 flex flex-col gap-2 mt-5">
                                        <div className="flex flex-col items-center gap-3">
                                            <input className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Intitulé du rôle" value={newRole.label} onChange={e => setNewRole(prev => ({ ...prev, label: e.target.value }))} />
                                            <textarea className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none h-20" placeholder="Description du rôle" value={newRole.description} onChange={e => setNewRole(prev => ({ ...prev, description: e.target.value }))} />
                                            <div className="w-full flex flex-col">
                                                <button>Couleur du rôle</button>
                                                <hr className="my-5 border-gray-600 w-full" />
                                                <div className="flex items-center justify-center flex-wrap w-full gap-3">
                                                    {colorRole.map((v, k) => (
                                                        <button onClick={() => setSelectedColor(v)} key={k} className={`${selectedColor === v && "border-2 border-green-800 w-[40px] h-[40px]"} w-[30px] h-[30px] rounded-full ${colorClasses[v]} cursor-pointer transition duration-500 hover:border-2 hover:border-white/40`}></button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full gap-3 mt-3">
                                            <button onClick={() => setDisplayCreation(0)} className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Annuler</button>
                                            <button onClick={handleCreateRole} className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-[0_15px_35px_rgba(250,204,21,0.4)] hover:brightness-110 transition duration-500 cursor-pointer active:scale-95 flex items-center justify-center gap-3 hover:text-black/70">Créer<IoIosArrowDroprightCircle /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                                <div className="relative flex flex-col items-center text-center px-8 py-9 w-full">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><IoMdPersonAdd /></div>
                                    <div className="flex items-center flex-col gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">Gestion des permissions</h2>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-65">Ajouter toutes les permissions dont vous avez besoin !</p>
                                    </div>
                                    <div className="w-2/3 flex flex-col gap-2 mt-5 bg-[#2a2a3d] w-full p-2">
                                        {/* {permissions[0].length === 0 && <button className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none">Aucune permission pour le moment !</button>} */}
                                        {permissions.map((table, keyTable) => (
                                            <div key={keyTable} className="w-full flex items-center gap-2">
                                                {table.map((v, k) => (
                                                    <div key={k} className="flex items-center gap-2">
                                                        {v.canBeSelected ? (
                                                            <button key={k} onClick={() => setPermissions(prev => prev.map(perms => perms[keyTable].id === v.id ? { ...perms, isSelected: !perms[keyTable].isSelected } : perms))} className={`${v.isSelected && "bg-green-500/40 hover:bg-green-700/40"} rounded-[8px] w-fit p-2 bg-[#151522] text-sm outline-none cursor-pointer transition duration-500 hover:bg-[#151522]/80`}>{v.name}</button>
                                                        ) : (
                                                            <button key={k} onClick={() => showNotif("Ceci n'est pas une permission !")} className={`w-fit p-2 font-bold italic rounded-lg text-sm outline-none`}>{v.name} →</button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {displayCreation === 2 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn">
                        <div className="flex w-full max-w-6xl gap-4">
                            <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                                <div className="relative flex flex-col items-center text-center px-8 py-9 w-full">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><LiaCriticalRole /></div>
                                    <div className="flex items-center flex-col gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">Création d'une permission</h2>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-65">Créer n'importe quelle permission grâce à notre configurateur !</p>
                                    </div>
                                    <div className="w-2/3 flex flex-col gap-2 mt-5">
                                        <div className="flex flex-col items-center gap-3">
                                            <input className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Intitulé du rôle" value={newRole.label} onChange={e => setNewRole(prev => ({ ...prev, label: e.target.value }))} />
                                            <textarea className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none h-20" placeholder="Description du rôle" value={newRole.description} onChange={e => setNewRole(prev => ({ ...prev, description: e.target.value }))} />
                                        </div>
                                        <div className="flex w-full gap-3 mt-3">
                                            <button onClick={() => setDisplayCreation(0)} className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Annuler</button>
                                            <button onClick={handleCreateRole} className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-[0_15px_35px_rgba(250,204,21,0.4)] hover:brightness-110 transition duration-500 cursor-pointer active:scale-95 flex items-center justify-center gap-3 hover:text-black/70">Créer<IoIosArrowDroprightCircle /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                                <div className="relative flex flex-col items-center text-center px-8 py-9 w-full">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><IoMdPersonAdd /></div>
                                    <div className="flex items-center flex-col gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight text-white">Gestion des permissions</h2>
                                        <p className="text-sm text-gray-400 leading-relaxed max-w-65">Ajouter toutes les permissions dont vous avez besoin !</p>
                                    </div>
                                    <div className="w-2/3 flex flex-col gap-2 mt-5">
                                        {permissions.length === 0 && (
                                            <div>
                                                <button className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none">Aucune permission pour le moment !</button>
                                            </div>
                                        )}
                                        {permissions.map((v, k) => (
                                            <button key={k}>v</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showModal === "set" && <InputNumber title="Modifier les coins" onClose={() => setShowModal(null)} onValidate={({ input1, input2 }) => { setCoins(input1, input2) }} input1={{ display: true, placeholder: "Nombre de coins", type: "number" }} input2={{ display: true, placeholder: "Raison" }} />}
                {showModal === "reset" && <InputNumber title="Reset des coins" onClose={() => setShowModal(null)} onValidate={({ input2 }) => { resetCoins(input2) }} input2={{ display: true, placeholder: "Raison" }} />}
            </div>
        </div>  
    )
}