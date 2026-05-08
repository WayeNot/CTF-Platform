"use client"

import { useEffect, useState } from "react"
import { useNotif } from "./NotifProvider"
import { Roles, User, UserSanctions, UserSessions, UserTransactions } from "@/lib/types"
import { IoIosArrowDroprightCircle, IoMdCheckboxOutline, IoMdPersonAdd } from "react-icons/io"
import { MdCheckBoxOutlineBlank } from "react-icons/md"
import InputNumber from "./ModalInput"
import { coinManagement, default_pp, statusColor } from "@/lib/config"
import Link from "next/link"
import { useApi } from "@/hooks/useApi"
import { useNavData } from "@/stores/store"
import { LiaCriticalRole } from "react-icons/lia"
import { RiMailSendLine } from "react-icons/ri";
import { CiDatabase } from "react-icons/ci";
import DisplayBan from "./ui/sanction/DisplayBan";
import DisplayWarn from "./ui/sanction/DisplayWarn";

export default function AdminPanel({ closePanel }: { closePanel: () => void }) {
    const { showNotif } = useNotif()
    const { call } = useApi()

    const { inMaintenance, updateInMaintenance } = useNavData()

    const [panelTab, setPanelTab] = useState("")
    const [userTab, setUserTab] = useState("Informations")

    const [users, setUsers] = useState<User[]>([])
    const [editUser, setEditUser] = useState(-1)

    const [userSessions, setUserSessions] = useState<UserSessions[]>([])
    const [userSanctions, setUserSanctions] = useState<UserSanctions[]>([])
    const [userTransactions, setUserTransactions] = useState<UserTransactions[]>([])

    const [sanction, setSanction] = useState<UserSanctions>()

    const [roles, setRoles] = useState<Roles[]>([])

    const [displayCreation, setDisplayCreation] = useState(-1)
    const [newRole, setNewRole] = useState({ label: "", description: "", allPerms: [] })

    const [showModal, setShowModal] = useState<null | "set" | "reset" | "warnUser" | "banUser" | "displayReasonBan" | "displayReasonWarn">(null)

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
        teal: "bg-teal-500/40"
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

    useEffect(() => {
        if (panelTab === "Gestion des utilisateurs") getAllUser()
        if (userTab === "Sessions") getUserSessions()
        if (userTab === "Sanctions") getUserSanctions()
        if (userTab === "Gestion des coins") getUserTransactions();
    }, [panelTab, userTab])

    const setMaintenance = async () => {
        await call("/api/admin/maintenance", { method: "PATCH", body: JSON.stringify({ inMaintenance: !inMaintenance }) }, [inMaintenance ? "Maintenance terminée avec succès !" : "Maintenance activée avec succès !"])
        updateInMaintenance(!inMaintenance)
    }

    // Administration des sessions de l'utilisateur ↓

    const getUserSessions = async () => {
        const data = await call(`/api/admin/${editUser}/session`)
        setUserSessions(data.data)
    }

    const getUserSanctions = async () => {
        const data = await call(`/api/admin/${editUser}/sanctions`)
        setUserSanctions(data.data)
    }

    const getUserTransactions = async () => {
        const data = await call(`/api/admin/${editUser}/transactions`)
        setUserTransactions(data.data)
    }

    const handleChangeSession = async (user_id: number, session_id: string, is_active: boolean) => {
        await call(`/api/admin/${editUser}/session`, { method: "PATCH", body: JSON.stringify({ session_id: session_id, is_active: is_active }) })
        setUserSessions(prev => prev.map(session => session.session_id === session_id && session.user_id === user_id ? { ...session, is_active: !is_active } : session))
        is_active ? showNotif(`Session n°${session_id} bien désactivée !`, "success") : showNotif(`Session n°${session_id} bien activée !`, "success")
    }

    const closeAllSession = async () => {
        await call(`/api/admin/${editUser}/session/closeAllSessions`, { method: "PATCH" })
        setUserSessions(prev => prev.map(session => session.is_active ? { ...session, is_active: false } : session))
        showNotif("Toutes les sessions ont bien été désactivées !", "success")
    }

    // Sanction sur l'utilisateur ↓

    const warnUser = async (reason: string) => {
        await call(`/api/admin/${editUser}/sanctions/warn`, { method: "POST", body: JSON.stringify({ reason: reason }) })
        showNotif(`L'utilisateur avec l'id ${editUser} a bien été averti !`, "success")
        setShowModal(null)
    }

    const banUser = async (reason: string, duration: number) => {
        setShowModal(null)
        await call(`/api/admin/${editUser}/sanctions/ban`, { method: "POST", body: JSON.stringify({ reason: reason, duration: duration }) })
        showNotif(`L'utilisateur avec l'id ${editUser} a bien été banni ${duration === 0 ? "définitivement" : "temporairement"} !`, "success")
        closeAllSession()
    }

    // Administration des coins de l'utilisateur ↓

    const updateCoin = async (value: number, reason: string) => {
        const data = await call(`/api/users/${editUser}/coin/`, { method: "PATCH", body: JSON.stringify({ operation: `${value < 0 ? "remove_coins" : "add_coins"}`, value: Math.abs(value), reason: reason || "" }) }, ["Nombre de coins bien mis à jour !"])
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coins: data.newSold } : user))
        setShowModal(null)
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
    }

    const resetCoins = async (reason: string = "") => {
        await call(`/api/users/${editUser}/coin`, { method: "PATCH", body: JSON.stringify({ operation: "reset_coins", value: 0, reason: reason || "" }) }, ["Nombre de coins reset avec succès !"])
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coins: 0 } : user))
        setShowModal(null)
    }

    const handleCreateRole = () => {
        if (!newRole || !newRole.label || !newRole.description || newRole.allPerms.length === 0) {
            showNotif("Veuillez remplir tout les champs !")
            return
        }
    }

    const panelTabLabel = ["Dashboard", "Gestion des utilisateurs", "Gestion des rôles", "Gestion des CTF", "Gestion des challenges", "Soumission des flags", "ScoreBoard", "Gestion des annonces", "Paramètres", "Logs & Sécurité"]
    const panelUserLabel = ["Informations", "Sessions", "Sanctions", "Gestion des coins", "Gestion des rôles", "Gestion de la progression", "Monitoring / débug"]

    return (
        <div id="overlay" className="fixed inset-0 z-50 flex items-center justify-center gap-15 bg-black/70 backdrop-blur-sm">
            <div className="w-7/8 h-3/4 bg-[#212529] border border-red-500/60 shadow-2xl p-6 animate-fadeIn">
                <div className="flex justify-center gap-5 max-h-[50vh] overflow-y-auto pr-2 text-center text-white/70">
                    <h2 className="text-white/70 text-[25px] font-mono font-bold">ADMIN PANEL - FlagCore</h2>
                    <button onClick={closePanel} className="text-gray-400 hover:text-white text-[25px] cursor-pointer transition duration-500">✕</button>
                </div>
                <hr className="my-5 border-white/30" />
                <div className="flex items-center justify-center w-full gap-3 mb-4">
                    {panelTabLabel.map((v, k) => <button key={k} onClick={() => setPanelTab(v)} className={`${panelTab === v ? "text-red-500" : "text-white/40"} font-mono px-2 text-[15px] py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#212529]`}>{v}</button>)}
                </div>
                {panelTab === "Gestion des utilisateurs" && (
                    <div className="w-full">
                        <div className="flex items-center gap-3 w-full">
                            {Array.isArray(users) && users.map((el) => (
                                <div onClick={() => { setEditUser(el.user_id); }} key={el.user_id} className="border border-gray-600 text-white/40 w-1/10 py-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer">
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
                                                        <button onClick={() => setSelectedColor(v)} key={k} className={`${selectedColor === v && "border-2 border-green-800 w-10 h-10"} w-7.5 h-7.5 rounded-full ${colorClasses[v]} cursor-pointer transition duration-500 hover:border-2 hover:border-white/40`}></button>
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
                                    <div className="flex flex-col gap-2 mt-5 bg-[#2a2a3d] w-full p-2">
                                        {/* {permissions[0].length === 0 && <button className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none">Aucune permission pour le moment !</button>} */}
                                        {permissions.map((table, keyTable) => (
                                            <div key={keyTable} className="w-full flex items-center gap-2">
                                                {table.map((v, k) => (
                                                    <div key={k} className="flex items-center gap-2">
                                                        {v.canBeSelected ? (
                                                            <button key={k} onClick={() => setPermissions(prev => prev.map(perms => perms[keyTable].id === v.id ? { ...perms, isSelected: !perms[keyTable].isSelected } : perms))} className={`${v.isSelected && "bg-green-500/40 hover:bg-green-700/40"} rounded-lg w-fit p-2 bg-[#151522] text-sm outline-none cursor-pointer transition duration-500 hover:bg-[#151522]/80`}>{v.name}</button>
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
            {editUser !== -1 && (
                <div className="w-7/8 absolute h-3/4 bg-[#212529] border border-red-500/60 shadow-2xl p-6 animate-fadeIn">
                    <div className="flex justify-between gap-5 max-h-[50vh] overflow-y-auto pr-2 text-center text-white/70">
                        <h2 className="font-bold italic text-[25px]">FlagCore</h2>
                        <h2 className="text-white/70 text-[25px] font-mono font-bold">GESTION DE L'UTILISATEUR - {userTab}</h2>
                        <button onClick={() => setEditUser(-1)} className="text-gray-400 hover:text-white text-[25px] cursor-pointer transition duration-500">✕</button>
                    </div>
                    <hr className="my-5 border-white/30" />
                    <div className="flex items-center justify-center w-full gap-3 mb-4">
                        {panelUserLabel.map((v, k) => <button key={k} onClick={() => setUserTab(v)} className={`${userTab === v ? "text-red-500" : "text-white/40"} font-mono px-2 text-[15px] py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#212529]`}>{v}</button>)}
                    </div>
                    {userTab === "Informations" && users.filter(el => el.user_id === editUser).map(el => (
                        <div key={el.user_id} className="flex flex-col gap-5 text-white">
                            <div className="flex items-center gap-5 font-bold text-white/40 mr-6">
                                <Link href={`/user/${el.username}`} className="flex items-center gap-3 text-[25px] hover:text-white/70 transition font-mono duration-500"><img src={el.pp_url || default_pp} alt="Logo de l'utilisateur" className={`w-20 bg-center bg-cover bg-no-repeat ${`${statusColor[el.status] || ""}`}`} /><span className="mx-2">-</span>{el.username} ( Session : {el.is_online ? <span className="text-green-700">Active</span> : <span className="text-red-700">Inactive</span>} )</Link>
                            </div>
                            <p className="flex items-center gap-3 text-[20px] w-fit">{el.email}<Link href={`mailto:${el.email}`}><RiMailSendLine className="cursor-pointer transition duration-500 hover:text-white/70 text-white/40" /></Link></p>
                            <p className="flex items-center gap-3 text-[20px] w-fit">Inscrit depuis le : {new Date(el.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                    {userTab === "Sessions" && (
                        <div className="flex flex-col gap-5">
                            <button onClick={closeAllSession} className="w-fit text-center text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer flex items-center gap-3">Fermer toutes les sessions de l'utilisateur</button>
                            {userSessions.length === 0 && <h2>Aucune session pour le moment !</h2>}
                            <div className="flex flex-col gap-3 max-h-100 overflow-y-auto">
                                <div className="overflow-x-auto rounded-xl border border-white/10">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-black/40 sticky top-0">
                                            <tr className="text-white/40 text-sm font-semibold">
                                                <th className="p-4">Id</th>
                                                <th className="p-4">Session ID</th>
                                                <th className="p-4">Statut</th>
                                                <th className="p-4 text-center">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {userSessions.map((v, k) => (
                                                <tr key={k} className="border-t border-white/10 hover:bg-white/5 transition duration-300">
                                                    <td className="p-4"><div className="flex items-center gap-2 text-white/40"><CiDatabase /><span>{k}</span></div></td>
                                                    <td className="p-4"><span className="text-white/70">{v.session_id}</span></td>
                                                    <td className="p-4"><span className={`px-3 py-1 ${v.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{v.is_active ? "Active" : "Inactive"}</span></td>
                                                    <td className="p-4"><button onClick={() => handleChangeSession(v.user_id, v.session_id, v.is_active)} className={`px-3 py-1 transition duration-500 cursor-pointer ${v.is_active ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}>{v.is_active ? "Désactiver" : "Activer"}</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    {userTab === "Sanctions" && (
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowModal("warnUser")} className="w-fit text-center text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer flex items-center gap-3">Avertir l'utilisateur</button>
                                <button onClick={() => setShowModal("banUser")} className="w-fit text-center text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer flex items-center gap-3">Bannir l'utilisateur</button>
                            </div>
                            {userSanctions.length === 0 && <h2>Aucune session pour le moment !</h2>}
                            <div className="flex flex-col gap-3 max-h-100 overflow-y-auto">
                                <div className="overflow-x-auto rounded-xl border border-white/10">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-black/40 sticky top-0">
                                            <tr className="text-white/40 text-sm font-semibold">
                                                <th className="p-4">Id</th>
                                                <th className="p-4">Type</th>
                                                <th className="p-4">Raison</th>
                                                <th className="p-4">Durée ( minute )</th>
                                                <th className="p-4">User Id</th>
                                                <th className="p-4">Staff Id</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Date d'expiration</th>
                                                <th className="p-4">Statut</th>
                                                {/* <th className="p-4 text-center">Action</th> */}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {userSanctions.map((v, k) => (
                                                <tr key={k} className="border-t border-white/10 hover:bg-white/5 transition duration-300 w-full">
                                                    <td className="p-4"><div className="flex items-center gap-2 text-white/40"><CiDatabase /><span>{v.id}</span></div></td>
                                                    <td className="p-4"><span className="text-white/70">{v?.type}</span></td>
                                                    <td onClick={() => { setSanction(v); v?.type === "ban" ? setShowModal("displayReasonBan") : setShowModal("displayReasonWarn") }} className="p-4 max-w-50"><span className="block text-white/70 cursor-pointer transition duration-500 hover:text-white/40 truncate">{v?.reason}</span></td>
                                                    <td className="p-4"><span className="text-white/70">{v?.duration}</span></td>
                                                    <td className="p-4"><span className="text-white/70">{v?.user_id}</span></td>
                                                    <td className="p-4"><span className="text-white/70">{v?.staff_id}</span></td>
                                                    <td className="p-4"><span className="text-white/70">{new Date(v?.created_at).toLocaleString()}</span></td>
                                                    <td className="p-4"><span className="text-white/70">{v.duration === 0 ? "Jamais" : new Date(v.expires_at).toLocaleString()}</span></td>
                                                    <td className="p-4"><span className={`px-3 py-1 ${v?.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{v.is_active ? "Active" : "Inactive"}</span></td>
                                                    {/* <td className="p-4"><button onClick={() => handleChangeSession(v.user_id, v.session_id, v.is_active)} className={`px-3 py-1 transition duration-500 cursor-pointer ${v.is_active ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}>{v.is_active ? "Désactiver" : "Activer"}</button></td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    {userTab === "Gestion des coins" && (
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
                            {userTransactions.length === 0 && <h2>Aucune session pour le moment !</h2>}
                            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                                <div className="overflow-x-auto rounded-xl border border-white/10">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-black/40 sticky top-0">
                                            <tr className="text-white/40 text-sm font-semibold">
                                                <th className="p-4">Id</th>
                                                <th className="p-4">Type</th>
                                                <th className="p-4">Montant</th>
                                                <th className="p-4">Raison</th>
                                                <th className="p-4">Id Staff</th>
                                                <th className="p-4">Reference Id</th>
                                                <th className="p-4">Date</th>
                                                {/* <th className="p-4 text-center">Action</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userTransactions.map((v, k) => (
                                                <tr key={k} className="border-t border-white/10 hover:bg-white/5 transition duration-300 w-full">
                                                    <td className="p-4"><div className="flex items-center gap-2 text-white/40"><CiDatabase /><span>{v.id}</span></div></td>
                                                    <td className="p-4"><span className={`${v?.type === "add_coins" && "text-green-500"} ${v?.type === "remove_coins" && "text-red-500"} ${v?.type === "set_coins" && "text-orange-500"} ${v?.type === "reset_coins" && "text-blue-500"}`}>{v?.type === "add_coins" && "Ajout"}{v?.type === "remove_coins" && "Retrait"}{v?.type === "set_coins" && "Set"}{v?.type === "reset_coins" && "Reset"}</span></td>
                                                    <td className="p-4"><span className={`p-2 ${v?.type === "add_coins" && "text-green-500"} ${v?.type === "remove_coins" && "text-red-500"} ${v?.type === "set_coins" && "text-orange-500"} ${v?.type === "reset_coins" && "text-blue-500"}`}>{v?.type === "add_coins" && `+${v?.amount}`}{v?.type === "remove_coins" && `-${v?.amount}`}{v?.type === "set_coins" && `${v?.amount}`}{v?.type === "reset_coins" && `${v?.amount}`}</span></td>
                                                    <td className="p-4 max-w-50"><span className="block text-white/70 cursor-pointer transition duration-500 hover:text-white/40 truncate">{v?.reason ? v?.reason : "Aucune"}</span></td>
                                                    <td className="p-4"><span className="text-white/70">{v?.staff_id}</span></td>
                                                    <td className="p-4"><span className="text-white/70">{v?.reference_id ? v?.reference_id : "Aucune"}</span></td>
                                                    <td className="p-4"><span className="text-white/70">{new Date(v?.created_at).toLocaleString()}</span></td>
                                                    {/* <td className="p-4"><button onClick={() => handleChangeSession(v.user_id, v.session_id, v.is_active)} className={`px-3 py-1 transition duration-500 cursor-pointer ${v.is_active ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}>{v.is_active ? "Désactiver" : "Activer"}</button></td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    {showModal === "warnUser" && <InputNumber title="Avertir un utilisateur" onClose={() => setShowModal(null)} onValidate={({ input1 }) => { warnUser(String(input1)) }} input1={{ display: true, placeholder: "Raison de l'avertissement", type: "text" }} input2={{ display: false, placeholder: "" }} />}
                    {showModal === "banUser" && <InputNumber title="Bannir un utilisateur ( 0 pour ban définitif )" onClose={() => setShowModal(null)} onValidate={({ input1, input2 }) => { banUser(String(input1), Number(input2)) }} input1={{ display: true, placeholder: "Raison du bannissement", type: "text" }} input2={{ display: true, placeholder: "Durée ( en minute )", type: "number" }} />}
                    {showModal === "displayReasonBan" && <DisplayBan id={sanction?.id || -1} staff_id={sanction?.staff_id || -1} reason={sanction?.reason || ""} duration={sanction?.duration || -1} expires_at={sanction?.expires_at || ""} onSelect={() => setShowModal(null)} />}
                    {showModal === "displayReasonWarn" && <DisplayWarn id={sanction?.id || -1} staff_id={sanction?.staff_id || -1} reason={sanction?.reason || ""} onSelect={() => setShowModal(null)} />}
                </div>
            )}
        </div>
    )
}