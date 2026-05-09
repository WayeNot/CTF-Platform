"use client"

import { useApi } from "@/hooks/useApi";
import { default_pp, statusColor } from "@/lib/config";
import { User } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { call } = useApi()
    const params = useParams<{ id: string }>();

    const [userData, setUserData] = useState<User>(); // user_id | username | bio | email | role | created_at | coins | points | pp_url | status | is_online | is_anonymous | banner

    const getUserData = async () => {
        const data = await call(`/api/user/${params.id}`)
        setUserData(data.data)
    }

    useEffect(() => {
        getUserData()
    }, [params])

    return (
        <div className="m-auto w-1/2 mt-2">
            <div>
                <img className="w-full bg-cover bg-center bg-no-repeat h-100 " src={userData?.banner} alt="" />
                <div className="flex items-end relative">
                    <div className="absolute bottom-5 left-5 flex items-center gap-3 text-[18px] hover:text-white/70 transition font-mono duration-500"><img src={userData?.pp_url || default_pp} alt="Logo de l'utilisateur" className={`w-35 bg-center bg-cover bg-no-repeat ${statusColor[userData?.status ?? "offline"]}`} /></div>
                    <div className="pl-45 bg-white/30 text-[#212529] w-full p-5">
                        <p className="font-bold text-[23px] flex items-center">@{userData?.username}</p>
                        <p>{'>'} {userData?.bio ? userData?.bio : "Aucune bio pour le moment !"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}