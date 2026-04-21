"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/hooks/userSession";
import { useApi } from "@/hooks/useApi";

import { ctf, geoint } from "@/lib/types";

import CtfBuilder from "@/components/challenges/ctf/CtfBuilder";
import GeointBuilder from "@/components/challenges/geoint/GeointBuilder";

import HomeTabs from "@/components/challenges/home/HomeTabs";
import CreateButtons from "@/components/challenges/home/CreateButtons";
import GeointGroups from "@/components/challenges/home/GeointGroups";
import ChallengeCard from "@/components/challenges/home/ChallengeCard";
import Link from "next/link";
import { useNavData } from "@/app/store";

export default function Home() {
    const { call } = useApi();
    const router = useRouter();

    const { isGuest, updateIsGuest, username, updateUsername, email, updateEmail, role, updateRole, pp_url, updatePp_url, status, updateStatus, coin, updateCoin } = useNavData()

    const [tab, setTab] = useState<0 | 1>(0);
    const [ctf, setCtf] = useState<ctf[]>([]);
    const [geoint, setGeoint] = useState<geoint[]>([]);
    const [openGeo, setOpenGeo] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await call(`/api/challenges?type=${tab === 0 ? "ctf" : "geoint"}`);
            tab === 0 ? setCtf(data || []) : setGeoint(data || []);
        })();
    }, [tab]);

    const open = (type: string, id: number) => router.push(`/challenges/${type}/${id}`);

    const groupedGeoint = useMemo(() => {
        const f = (l: string) => geoint.filter(e => e.difficulty === l);
        return {
            Facile: f("Facile"),
            Intermédiaire: f("Intermédiaire"),
            Avancé: f("Avancé"),
            Expert: f("Expert"),
        };
    }, [geoint]);

    return (
        <div className="min-h-screen text-white">

            <HomeTabs tab={tab} setTab={setTab} />

            {tab === 0 && (
                <div className="px-6 space-y-6">
                    <CreateButtons
                        type="ctf"
                        role={role[0]}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {ctf.map(c => (
                            <ChallengeCard key={c.id} title={c.title} onClick={() => open("ctf", c.id)} />
                        ))}
                    </div>
                </div>
            )}

            {tab === 1 && (
                <div className="px-6 space-y-10">
                    <CreateButtons
                        type="geoint"
                        role={role[0]}
                        onGeoOpen={() => setOpenGeo(true)}
                    />
                    {isGuest ? (
                        <div className="relative">
                            <div className="blur-xs scale-[1.01] pointer-events-none select-none opacity-80">
                                <GeointGroups data={groupedGeoint} open={open} />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-[#1e1e2f]/90 border border-white/10 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md max-w-md w-full">
                                    <div className="text-4xl mb-3">🔒</div>
                                    <h2 className="text-white text-xl font-bold mb-2">GEOINT verrouillé</h2>
                                    <p className="text-white/60 text-sm mb-6">Connectez-vous pour accéder aux missions et suivre votre progression.</p>
                                    <p className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition duration-500 cursor-pointer text-white font-semibold">Se connecter</p>
                                    <p className="text-white/30 text-xs mt-4"> Aperçu disponible — accès complet après connexion</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <GeointGroups data={groupedGeoint} open={open} />
                    )}
                </div>
            )}
            <CtfBuilder />
            {openGeo && <GeointBuilder onClose={() => setOpenGeo(false)} />}
        </div>
    );
}