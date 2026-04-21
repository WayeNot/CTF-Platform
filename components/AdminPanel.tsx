"use client"

import { useEffect, useState } from "react"
import { useNotif } from "./NotifProvider"
import { User } from "@/lib/types"
import { IoMdCheckboxOutline } from "react-icons/io"
import { MdAlternateEmail, MdCheckBoxOutlineBlank } from "react-icons/md"
import InputNumber from "./ModalInput"
import { coinManagement, default_pp, statusColor } from "@/lib/config"
import Link from "next/link"
import { TbCoinRupeeFilled } from "react-icons/tb"
import { LuCalendar1 } from "react-icons/lu"
import { useApi } from "@/hooks/useApi"
import { useNavData } from "@/app/store"

export default function AdminPanel({ closePanel }: { closePanel: () => void }) {
    const { showNotif } = useNotif()
    const { call } = useApi()

    const { username, updateUsername, email, updateEmail, role, updateRole, pp_url, updatePp_url, status, updateStatus, coin, updateCoin } = useNavData()

    const [panelTab, setPanelTab] = useState(0)

    const [users, setUsers] = useState<User[]>([])
    const [editUser, setEditUser] = useState(-1)
    const [inMaintenance, setInMaintenance] = useState(false)

    const [showModal, setShowModal] = useState<null | "set" | "reset">(null)
    const [panelUser, setPanelUser] = useState(0)

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

    useEffect(() => {
        if (panelTab === 1) {
            getAllUser()
        } else if (panelTab === 2) {
            getMaintenance()
        }
    }, [panelTab])

    const setMaintenance = async () => {
        await call("/api/admin/maintenance", { method: "PATCH", body: JSON.stringify({ inMaintenance: !inMaintenance }) }, inMaintenance ? "Maintenance terminée avec succès !" : "Maintenance activée avec succès !")
        setInMaintenance(!inMaintenance)
    }

    const updateCoins = async (value: number, reason: string) => {
        const data = await call(`/api/users/${editUser}/coin/`, { method: "PATCH", body: JSON.stringify({ operation: `${value < 0 ? "remove_coin" : "add_coin"}`, value: Math.abs(value), reason: reason || "" }) }, "Nombre de coin bien mis à jour !")
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coin: data.newSold } : user))
        setShowModal(null)
        updateCoin(data.newSold)
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
        const data = await call(`/api/users/${editUser}/coin`, { method: "PATCH", body: JSON.stringify({ operation: "set_coin", value: Math.abs(num), reason: reason || "" }) }, "Nombre de coin set avec succès !")
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coin: data.newSold } : user))
        updateCoin(data.newSold)
    }

    const resetCoin = async (reason: string = "") => {
        await call(`/api/users/${editUser}/coin`, { method: "PATCH", body: JSON.stringify({ operation: "reset_coin", value: 0, reason: reason || "" }) }, "Nombre de coin reset avec succès !")
        setUsers(prev => prev.map(user => user.user_id === editUser ? { ...user, coin: 0 } : user))
        setShowModal(null)
        updateCoin(0)
    }

    return (
        <div id="overlay" className="fixed inset-0 z-50 flex items-center justify-center gap-15 bg-black/70 backdrop-blur-sm">
            <div className="w-9/10 h-3/4 bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">
                <div className="flex flex-col gap-5 max-h-[50vh] overflow-y-auto pr-2 text-center text-white/70">
                    <h2 className="text-orange-500 italic font-bold">Panel admin - CTF Platform</h2>
                </div>
                <hr className="my-5 border-gray-600" />
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center justify-center gap-5">
                        <button onClick={() => setPanelTab(0)} className={`${panelTab === 0 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Dashboard</button>
                        <button onClick={() => setPanelTab(1)} className={`${panelTab === 1 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des utilisateurs</button>
                        <button onClick={() => setPanelTab(2)} className={`${panelTab === 2 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des CTF</button>
                        <button onClick={() => setPanelTab(3)} className={`${panelTab === 3 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des challenges</button>
                        <button onClick={() => setPanelTab(4)} className={`${panelTab === 4 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Soumission des flags</button>
                        <button onClick={() => setPanelTab(5)} className={`${panelTab === 5 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>ScoreBoard</button>
                        <button onClick={() => setPanelTab(6)} className={`${panelTab === 6 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Gestion des annonces</button>
                        <button onClick={() => setPanelTab(7)} className={`${panelTab === 7 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Paramètres</button>
                        <button onClick={() => { getMaintenance(); setPanelTab(8) }} className={`${panelTab === 8 ? "text-orange-400" : "text-white/40"} rounded-md px-3 py-1 hover:text-white/60 cursor-pointer transition duration-500 bg-[#2a2a3d]`}>Logs & Sécurité</button>
                    </div>
                    <button onClick={closePanel} className="text-gray-400 hover:text-white cursor-pointer transition duration-500">✕</button>
                </div>
                {panelTab === 1 && (
                    <div className="w-full">
                        <div className="flex items-center gap-3 w-full">
                            {Array.isArray(users) && users.map((el) => (
                                <div onClick={() => setEditUser(el.user_id)} key={el.user_id} className="border border-gray-600 text-white/40 rounded-[7px] w-1/10 py-3 hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer">
                                    <p className="text-center">{el.user_id} | {el.username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {panelTab === 8 && (
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
                                            <p onClick={() => setPanelUser(1)} className="flex items-center gap-2 font-bold w-fit text-[25px] text-orange-400 transition duration-500 hover:text-orange-500 cursor-pointer"><TbCoinRupeeFilled /> - {el.coin || 0}</p>
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
                                                <button key={k} onClick={() => updateCoins(Number(v), "")} className="w-fit text-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer">{v}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-full flex items-center">
                                        <button onClick={() => setShowModal("set")} className="flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Modifier le nombre de coin</button>
                                        <button onClick={() => setShowModal("reset")} className="flex items-center gap-3 text-white/40 p-4 border border-gray-600 rounded-[7px] hover:text-[#1e1e2f] hover:bg-white/40 transition duration-500 cursor-pointer text-center">Reset le nombre de coin</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {showModal === "set" && <InputNumber title="Modifier les coins" onClose={() => setShowModal(null)} onValidate={({ input1, input2 }) => { setCoins(input1, input2) }} input1={{ display: true, placeholder: "Nombre de coins", type: "number" }} input2={{ display: true, placeholder: "Raison" }} />}
                {showModal === "reset" && <InputNumber title="Reset des coins" onClose={() => setShowModal(null)} onValidate={({ input2 }) => { resetCoin(input2) }} input2={{ display: true, placeholder: "Raison" }} />}
            </div>
        </div>
    )
}