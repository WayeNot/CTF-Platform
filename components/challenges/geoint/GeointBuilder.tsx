"use client";

import { useState } from "react";
import { FaImage } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDescription } from "react-icons/md";
import DropDown from "@/components/ui/DropDown";
import { difficultyBtn, difficulty, GeointBuilderState } from "@/lib/types";
import { TbCoinRupeeFilled } from "react-icons/tb";

export default function GeointBuilder({ onClose, onCreate }: any) {
    const [builder, setBuilder] = useState<GeointBuilderState>({ title: "", description: "", difficulty: "", image: "", flag: "", hint: "", hint_cost: undefined, coin_reward: undefined, points: undefined });
    const [difficultyOpen, setDifficultyOpen] = useState(false);
    const canCreate = builder.title && builder.description && builder.difficulty && builder.flag && builder.image;

    const handleChange = (key: keyof GeointBuilderState, value: any) => setBuilder(prev => ({ ...prev, [key]: value }));

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="w-full max-w-6xl flex gap-4">
                <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl shadow-2xl text-white flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h2 className="font-bold text-sm flex items-center gap-2"><BsLightningChargeFill className="text-orange-400" /> GEOINT BUILDER</h2>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition duration-500 cursor-pointer"><IoMdClose size={18} /></button>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto max-h-[80vh]">
                        <div className="flex gap-2">
                            <div className="relative w-1/2">
                                <input placeholder=" " className="peer w-full bg-[#232336] p-2 pt-4 rounded-lg text-sm outline-none border border-white/5 focus:border-orange-500" value={builder.title} onChange={e => handleChange("title", e.target.value)} />
                                <label className="absolute left-2 top-1 text-[10px] text-white/40 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 transition-all">Nom du challenge</label>
                            </div>
                            <DropDown label="Difficulté" value={builder.difficulty} isOpen={difficultyOpen} options={difficultyBtn} onToggle={() => setDifficultyOpen(!difficultyOpen)} onSelect={(v) => handleChange("difficulty", v as difficulty)} />
                        </div>
                        <div className="flex gap-2">
                            <div className="relative w-1/2">
                                <input type="number" placeholder=" " className="peer w-full bg-[#232336] p-2 pt-4 rounded-lg text-sm outline-none border border-white/5 focus:border-green-500" value={builder.points} onChange={e => handleChange("points", Number(e.target.value))} />
                                <label className="absolute left-2 top-1 text-[10px] text-white/40 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 transition-all">Points</label>
                            </div>
                            <div className="relative w-1/2">
                                <input type="number" placeholder=" " className="peer w-full bg-[#232336] p-2 pt-4 rounded-lg text-sm outline-none border border-white/5 focus:border-green-500" value={builder.coin_reward} onChange={e => handleChange("coin_reward", Number(e.target.value))} />
                                <label className="absolute left-2 top-1 text-[10px] text-white/40 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 transition-all">Coins 🪙</label>
                            </div>
                        </div>
                        <div className="relative">
                            <textarea placeholder=" " className="peer w-full bg-[#232336] p-2 pt-5 rounded-lg text-sm outline-none border border-white/5 focus:border-orange-500 h-20 resize-none" value={builder.description} onChange={e => handleChange("description", e.target.value)} />
                            <label className="absolute left-2 top-1 text-[10px] text-white/40 peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 transition-all">Description</label>
                        </div>
                        <div className="relative">
                            <input placeholder=" " className="peer w-full bg-[#232336] p-2 pt-4 rounded-lg text-sm outline-none border border-white/5 focus:border-orange-500" value={builder.flag} onChange={e => handleChange("flag", e.target.value)} />
                            <label className="absolute left-2 top-1 text-[10px] text-white/40 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 transition-all">Flag attendu</label>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative w-full">
                                <input placeholder=" " className="peer w-full bg-[#232336] p-2 pt-4 rounded-lg text-sm outline-none border border-white/5 focus:border-orange-500" value={builder.hint} onChange={e => handleChange("hint", e.target.value)} />
                                <label className="absolute left-2 top-1 text-[10px] text-white/40 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 transition-all">Indice</label>
                            </div>
                            {builder.hint && (
                                <div className="relative w-1/2">
                                    <input type="number" placeholder=" " className="peer w-full bg-[#232336] p-2 pt-4 rounded-lg text-sm outline-none border border-white/5 focus:border-green-500" value={builder.hint_cost} onChange={e => handleChange("hint_cost", Number(e.target.value))} />
                                    <label className="absolute left-2 top-1 text-[10px] text-white/40 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 transition-all">Prix 🪙</label>
                                </div>
                            )}
                        </div>
                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-3">
                            <div className="text-white/60 text-xs">Image de départ</div>
                            <div className="relative">
                                <input placeholder=" " className="peer w-full bg-[#232336] p-2 pt-4 rounded-lg text-sm outline-none border border-white/5 focus:border-blue-500" value={builder.image} onChange={e => handleChange("image", e.target.value)} />
                                <label className="absolute left-2 top-1 text-[10px] text-white/40 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 transition-all">URL de l'image</label>
                            </div>
                            {builder.image && <img src={builder.image} className="w-full h-40 object-cover rounded-lg border border-white/10" />}
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/10 flex items-center justify-center gap-4">
                        <button onClick={onClose} className="px-6 py-2 bg-red-500/10 text-red-300 rounded-lg hover:bg-red-500/20 transition duration-500 cursor-pointer">Annuler</button>
                        <button disabled={!canCreate} onClick={() => onCreate(builder)} className="px-6 py-2 bg-green-500/10 text-green-300 rounded-lg hover:bg-green-500/20 transition duration-500 cursor-pointer disabled:opacity-40">Créer</button>
                    </div>
                </div>
                <div className="w-1/2 bg-[#12121c] border border-white/10 rounded-2xl p-6 text-white space-y-5 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold flex items-center gap-2 text-white/90">
                            <MdOutlineDescription className="text-orange-400 text-lg" />
                            Aperçu
                        </h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">
                            🔴 - live preview
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <p className="text-white/40 text-xs">Nom</p>
                            <p className="text-white font-medium truncate">{builder.title || "N/A"}</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <p className="text-white/40 text-xs">Difficulté</p>
                            <p className="text-orange-300 font-medium">{builder.difficulty || "N/A"}</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <p className="text-white/40 text-xs">Points</p>
                            <p className="text-white font-medium">{builder.points || 0}</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <p className="text-white/40 text-xs">Indice</p>
                            <p className="text-white font-medium truncate">{builder.hint || "N/A"}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
                        <p className="text-white/40 text-xs">Flag</p>
                        <p className="text-white font-mono text-sm break-all">{builder.flag || "N/A"}</p>
                    </div>

                    {builder.hint && (
                        <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                            <p className="text-white/70 text-sm">Coût de l'indice</p>
                            <p className="text-orange-300 font-semibold flex items-center gap-2"><TbCoinRupeeFilled className="text-[20px]" />{builder.hint_cost || 0}</p>
                        </div>
                    )}

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                        <p className="text-white/40 text-xs">Description</p>
                        <div className="max-h-20 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <p className="text-white/60 text-sm leading-relaxed break-words">
                                {builder.description || "Aucune description"}
                            </p>
                        </div>
                    </div>

                    {builder.image && (
                        <div className="relative">
                            <img
                                src={builder.image}
                                className="w-full h-52 object-cover rounded-xl border border-white/10 shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}