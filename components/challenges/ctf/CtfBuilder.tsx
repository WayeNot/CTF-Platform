"use client";

import { FaFlag } from "react-icons/fa";
import { useState } from "react";

import DropDown from "@/components/ui/DropDown";
import { categoryBtn, difficultyBtn, NewCtfFlag, difficulty, category, CtfBuilderState, ctf } from "@/lib/types";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDescription } from "react-icons/md";
import { useNotif } from "@/components/NotifProvider";
import CreateFlag from "../CreateFlag";
import InsertFile from "../InsertFile";

export default function CtfBuilder({ onClose } : any) {
    const { showNotif } = useNotif()

    const [builder, setBuilder] = useState<CtfBuilderState>({ title: "", description: "", difficulty: null, category: [], flag_format: "", coins: undefined, points: undefined, files: [] });
    const [flags, setFlags] = useState<NewCtfFlag[]>([])
    const [files, setFiles] = useState<File[]>([]);

    const [settings, setSettings] = useState({ difficulty: false, category: false });

    const [displayFiles, setDisplayFiles] = useState(false)
    const [displayFlags, setDisplayFlags] = useState(false)

    const resetBuilder = () => {
        setBuilder({ title: "", description: "", difficulty: null, category: [], flag_format: "", coins: undefined, points: undefined, files: [] })
        setFlags([])
        setFiles([])
        setSettings({ difficulty: false, category: false })
        setDisplayFiles(false)
        setDisplayFlags(false)
        onClose();
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const removeFlag = (index: number) => {
        setFlags(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreate = async () => {
        const formData = new FormData();
        files.forEach(f => formData.append("files[]", f));

        const res = await fetch("/api/challenges/uploadFiles", {
            method: "POST",
            body: formData
        })

        if (!res.ok) {
            const err = await res.json()
            showNotif(err.error, "error")
            return
        }

        const data = await res.json();

        await fetch("/api/challenges?type=ctf", {
            method: "POST",
            body: JSON.stringify({ challenge: builder, flags: flags, files: data.files })
        })

        resetBuilder();
    };

    const canCreate = builder.title && builder.description && builder.difficulty && builder.category?.length && builder.flag_format;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex w-full max-w-6xl gap-4">
                <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#161625]">
                        <h1 className="text-sm font-bold tracking-wide">CTF Builder</h1>
                        <button onClick={() => resetBuilder()} className="text-white/40 hover:text-white transition duration-500 cursor-pointer"><IoMdClose size={18} /></button>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto max-h-[75vh]">
                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-2">
                            <div className="text-[11px] text-white/40">Informations générales</div>
                            <div className="grid grid-cols-2 gap-2">
                                <input className="p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-orange-500 transition" placeholder="Titre du challenge" value={builder.title} onChange={e => setBuilder({ ...builder, title: e.target.value })} />
                                <input className="p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-orange-500 transition" placeholder="Format du flag" value={builder.flag_format} onChange={e => setBuilder({ ...builder, flag_format: e.target.value })} />
                            </div>
                        </div>
                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-2 w-full">
                            <div className="text-[11px] text-white/40">Description</div>
                            <textarea className="w-full h-20 overflow-y-auto p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-orange-500 transition resize-none" placeholder="Description" value={builder.description} onChange={e => setBuilder({ ...builder, description: e.target.value })} />
                        </div>
                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-2">
                            <div className="text-[11px] text-white/40">Configuration du challenge</div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#232336] rounded-lg p-2">
                                    <DropDown isOnce label="Difficulté" value={builder.difficulty} isOpen={settings.difficulty} options={difficultyBtn} onToggle={() => setSettings(s => ({ ...s, difficulty: !s.difficulty }))} onSelect={(v) => { setBuilder({ ...builder, difficulty: v }); setSettings({ ...settings, difficulty: false }) }} />
                                </div>
                                <div className="bg-[#232336] rounded-lg p-2">
                                    <DropDown isOnce={false} label="Catégorie" value={builder.category} isOpen={settings.category} options={categoryBtn} onToggle={() => setSettings(s => ({ ...s, category: !s.category }))} onSelect={(v) => { setBuilder(prev => ({ ...prev, category: prev.category.some(c => c.value === v.value) ? prev.category.filter(c => c.value !== v.value) : [...prev.category, v] })); }} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-2">
                            <div className="text-[11px] text-white/40">Récompense du challenge ( 🪙 - Coins / 🥇 - Points )</div>
                            <div className="grid grid-cols-2 gap-2">
                                <input className="w-full p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-green-500 transition" placeholder="Récompense de points global" type="number" value={builder.coins} onChange={e => setBuilder({ ...builder, coins: Number(e.target.value) })} />
                                <input className="w-full p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-green-500 transition" placeholder="Récompense en coins" type="number" value={builder.points} onChange={e => setBuilder({ ...builder, points: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>
                    <div className="p-3 border-t border-white/10 bg-[#161625] grid grid-cols-2 gap-2">
                        <button onClick={() => setDisplayFiles(true)} className="bg-[#232336] hover:bg-[#2a2a3d] text-xs py-2 rounded-lg transition duration-500 cursor-pointer">📁 Fichiers</button>
                        <button onClick={() => setDisplayFlags(true)} className="bg-[#232336] hover:bg-[#2a2a3d] text-xs py-2 rounded-lg transition duration-500 cursor-pointer">🚩 Flags</button>
                        <button onClick={() => resetBuilder() } className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 rounded-lg transition duration-500 cursor-pointer">Annuler</button>
                        <button disabled={!canCreate} onClick={handleCreate} className="bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 rounded-lg transition duration-500 disabled:opacity-40 cursor-pointer">Créer</button>
                    </div>
                </div>
                <div className="w-1/2 bg-[#12121c] border border-white/10 rounded-2xl p-6 text-white space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold flex items-center gap-2 text-white/90"><MdOutlineDescription className="text-orange-400 text-lg" />Aperçu</h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">🔴 - live preview</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-white/50">🏷️ <span>Titre</span></div>
                            <p className="text-white font-medium truncate">{builder.title || "N/A"}</p>
                        </div>
                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-white/50">🏁 <span>Format du flag</span></div>
                            <p className="text-orange-400 font-semibold">{builder.flag_format || "N/A"}</p>
                        </div>
                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5 col-span-2">
                            <div className="flex items-center gap-2 text-white/50">📝<span>Description</span></div>
                            <div className="max-h-20 w-full overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                <p className="text-white/60 w-full text-sm leading-relaxed wrap-break-word whitespace-pre-line">{builder.description || "Aucune description"}</p>
                            </div>
                        </div>
                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white/50">⚡ <span>Difficulté</span></div>
                            <p className={`text-[12px] w-fit px-2 py-0.5 rounded-full bg-green-500/10 ${builder.difficulty?.color}`}>{builder.difficulty?.label || "N/A"}</p>
                        </div>
                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white/50">🏷️ <span>Catégories</span></div>
                            <p className="text-white font-medium flex items-center gap-2 flex-wrap">{builder.category?.length ? builder.category.map(v => <span className={`text-[12px] px-2 py-0.5 rounded-full bg-green-500/10 ${v.color}`}>{v.value}</span>) : "N/A"}</p>
                        </div>
                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-white/50">🪙 <span>Récompense ( coins )</span></div>
                            <p className="text-green-400 font-semibold">{builder.coins || "0"}</p>
                        </div>
                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-white/50">🥇 <span>Récompense ( point )</span></div>
                            <p className="text-green-400 font-semibold">{builder.points || "0"}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/70 font-semibold">📁 <span>Fichiers</span></div>
                        <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                            {!Array.isArray(files) || files.length === 0 ? <p className="text-white/30 text-sm">Aucun fichier</p> : (
                                files.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between bg-[#1a1a28] p-2 rounded-lg text-sm border border-white/5 hover:border-white/20 transition duration-500">
                                        <span className="truncate text-white/70">📄 {f.name}</span>
                                        <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-300 transition duration-500 cursor-pointer">✕</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/70 font-semibold">🚩 <span>Flags</span></div>
                        <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                            {flags.length === 0 && <p className="text-white/30 text-sm">Aucun flag</p>}
                            {flags.map((f, i) => (
                                <div key={i} className="flex justify-between items-center gap-2 bg-[#1a1a28] p-2 rounded-lg border border-white/5 text-sm hover:border-white/20 transition duration-500">
                                    <div className="w-full flex items-center gap-2">
                                        <span className="text-orange-400"><FaFlag /></span>
                                        <span className="text-white/70 truncate">{f.title}</span>
                                        <span className="text-white/30">|</span>
                                        <span className="text-white/50 truncate">{f.flag}</span>
                                    </div>
                                    <button onClick={() => removeFlag(i)} className="text-red-400 hover:text-red-300 transition duration-500">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {displayFiles && <InsertFile onClose={() => setDisplayFiles(false)} onSubmit={(files) => setFiles(prev => [...prev, ...files])} />}
            {displayFlags && <CreateFlag onClose={() => setDisplayFlags(false)} onSubmit={(flag) => setFlags(prev => [...prev, flag])} />}
        </div>
    );
}