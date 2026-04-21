"use client";

import { FaFlag } from "react-icons/fa";
import { useState } from "react";

import DropDown from "@/components/ui/DropDown";
import { categoryBtn, difficultyBtn, NewCtfFlag, difficulty, category } from "@/lib/types";
import { useCtfBuilderStore } from "@/stores/useCtfBuilderStore";
import { MdOutlineDescription } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

export default function CtfBuilder() {

    const { isOpen, setOpen, builder, setBuilder, flags, setFlags, selectedFiles, setSelectedFiles, resetBuilder } = useCtfBuilderStore();

    const [settings, setSettings] = useState({
        difficulty: false,
        category: false,
        files: false,
        flags: false
    });

    const [newFlag, setNewFlag] = useState<NewCtfFlag>({
        title: "",
        description: "",
        flag: "",
        flag_format: "",
        hint: "",
        hint_cost: undefined,
        coin_reward: undefined,
        points: undefined,

    });

    const [reward, setReward] = useState(0);

    if (!isOpen) return null;

    const addFile = (files: FileList | null) => {
        if (!files) return;
        setSelectedFiles([...selectedFiles, ...Array.from(files)]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const addFlag = () => {
        setFlags([...flags, newFlag]);
        setNewFlag({ title: "", description: "", flag: "", flag_format: "", hint: "", hint_cost: undefined, coin_reward: undefined, points: undefined });
    };

    const handleCreate = async () => {
        const formData = new FormData();

        formData.append("type", "ctf");
        formData.append("title", builder.title);
        formData.append("description", builder.description);
        formData.append("difficulty", builder.difficulty);
        formData.append("category", JSON.stringify(builder.category));
        formData.append("flag_format", builder.flag_format);
        formData.append("flags", JSON.stringify(flags));
        formData.append("reward", JSON.stringify(reward));

        selectedFiles.forEach(f => formData.append("files", f));

        await fetch("/api/challenges?type=ctf", {
            method: "POST",
            body: formData
        });

        resetBuilder();
        setOpen(false);
    };

    const canCreate =
        builder.title &&
        builder.description &&
        builder.difficulty &&
        builder.category.length &&
        builder.flag_format;

    const removeFlag = (index: number) => {
        setFlags(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="flex w-full max-w-6xl gap-4">

                <div className="w-1/2 bg-[#151522] border border-white/10 rounded-2xl text-white flex flex-col shadow-2xl overflow-hidden">

                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#161625]">
                        <h1 className="text-sm font-bold tracking-wide">CTF Builder</h1>
                        <button onClick={() => { resetBuilder(); setOpen(false); }} className="text-white/40 hover:text-white transition duration-500 cursor-pointer"><IoMdClose size={18} /></button>
                    </div>

                    <div className="p-4 space-y-4 overflow-y-auto max-h-[75vh]">

                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-2">
                            <div className="text-[11px] text-white/40">Informations générales</div>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    className="p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-orange-500 transition"
                                    placeholder="Titre du challenge"
                                    value={builder.title}
                                    onChange={e => setBuilder({ title: e.target.value })}
                                />
                                <input
                                    className="p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-orange-500 transition"
                                    placeholder="Description"
                                    value={builder.description}
                                    onChange={e => setBuilder({ description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-2">
                            <div className="text-[11px] text-white/40">Configuration du challenge</div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#232336] rounded-lg p-2">
                                    <DropDown
                                        label="Difficulté"
                                        value={builder.difficulty}
                                        isOpen={settings.difficulty}
                                        options={difficultyBtn}
                                        onToggle={() => setSettings(s => ({ ...s, difficulty: !s.difficulty }))}
                                        onSelect={v => setBuilder({ difficulty: v as difficulty })}
                                    />
                                </div>

                                <div className="bg-[#232336] rounded-lg p-2">
                                    <DropDown
                                        label="Catégorie"
                                        value={builder.category}
                                        isOpen={settings.category}
                                        options={categoryBtn}
                                        onToggle={() => setSettings(s => ({ ...s, category: !s.category }))}
                                        onSelect={(v) => {
                                            setBuilder({
                                                category: builder.category.includes(v as category)
                                                    ? builder.category.filter(c => c !== v)
                                                    : [...builder.category, v as category]
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-2">
                            <div className="text-[11px] text-white/40">Validation</div>

                            <input
                                className="w-full p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-orange-500 transition"
                                placeholder="Format du flag (ex: Prenom_Nom)"
                                value={builder.flag_format}
                                onChange={e => setBuilder({ flag_format: e.target.value })}
                            />
                        </div>

                        <div className="bg-[#1b1b2a] border border-white/5 rounded-xl p-3 space-y-2">
                            <div className="text-[11px] text-white/40">Récompense</div>

                            <input
                                className="w-full p-2 bg-[#232336] rounded-lg text-xs outline-none border border-white/5 focus:border-green-500 transition"
                                placeholder="Coins reward global"
                                type="number"
                                value={reward}
                                onChange={e => setReward(Number(e.target.value))}
                            />
                        </div>

                    </div>

                    <div className="p-3 border-t border-white/10 bg-[#161625] grid grid-cols-2 gap-2">

                        <button
                            onClick={() => setSettings(s => ({ ...s, files: true }))}
                            className="bg-[#232336] hover:bg-[#2a2a3d] text-xs py-2 rounded-lg transition duration-500 cursor-pointer"
                        >
                            📁 Fichiers
                        </button>

                        <button
                            onClick={() => setSettings(s => ({ ...s, flags: true }))}
                            className="bg-[#232336] hover:bg-[#2a2a3d] text-xs py-2 rounded-lg transition duration-500 cursor-pointer"
                        >
                            🚩 Flags
                        </button>

                        <button
                            onClick={() => { resetBuilder(); setOpen(false); }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 rounded-lg transition duration-500 cursor-pointer"
                        >
                            Annuler
                        </button>

                        <button
                            disabled={!canCreate}
                            onClick={handleCreate}
                            className="bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 rounded-lg transition duration-500 disabled:opacity-40 cursor-pointer"
                        >
                            Créer
                        </button>

                    </div>

                </div>

                {/* RIGHT PREVIEW */}
                <div className="w-1/2 bg-[#12121c] border border-white/10 rounded-2xl p-6 text-white space-y-5 shadow-2xl">

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

                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-white/50">🏷️ <span>Titre</span></div>
                            <p className="text-white font-medium truncate">{builder.title || "N/A"}</p>
                        </div>

                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-white/50">⚡ <span>Difficulté</span></div>
                            <p className="text-white font-medium">{builder.difficulty || "N/A"}</p>
                        </div>

                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5 col-span-2">
                            <div className="flex items-center gap-2 text-white/50">📝 <span>Description</span></div>
                            <p className="text-white/80 text-sm line-clamp-2">{builder.description || "N/A"}</p>
                        </div>

                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5 col-span-2">
                            <div className="flex items-center gap-2 text-white/50">🏷️ <span>Catégories</span></div>
                            <p className="text-white font-medium">{builder.category.length ? builder.category.join(", ") : "N/A"}</p>
                        </div>

                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5 col-span-2">
                            <div className="flex items-center gap-2 text-white/50">🏁 <span>Format du flag</span></div>
                            <p className="text-orange-400 font-semibold">{builder.flag_format || "N/A"}</p>
                        </div>

                        <div className="bg-[#1a1a28] p-3 rounded-xl border border-white/5 col-span-2">
                            <div className="flex items-center gap-2 text-white/50">💰 <span>Récompense</span></div>
                            <p className="text-green-400 font-semibold">{reward || "0"}</p>
                        </div>

                    </div>

                    <div className="space-y-2">

                        <div className="flex items-center gap-2 text-white/70 font-semibold">📁 <span>Fichiers</span></div>

                        <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                            {!Array.isArray(selectedFiles) || selectedFiles.length === 0 ? (
                                <p className="text-white/30 text-sm">Aucun fichier</p>
                            ) : (
                                selectedFiles.map((f, i) => (
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

            {settings.files && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div className="bg-[#12121c] w-[560px] rounded-2xl p-5 text-white shadow-2xl border border-white/10 space-y-4">
                        <div className="text-center">
                            <h2 className="text-lg font-bold">Fichiers du challenge</h2>
                            <p className="text-white/40 text-xs">Glisser-déposer ou sélectionner des fichiers</p>
                        </div>
                        <div
                            className="border border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-orange-500 transition duration-500 flex flex-col items-center justify-center gap-2"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const files = Array.from(e.dataTransfer.files || []);
                                setSelectedFiles(prev => [...prev, ...files]);
                            }}
                            onClick={() => document.getElementById("fileInput")?.click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (!files) return;
                                    setSelectedFiles(prev => [...prev, ...Array.from(files)]);
                                }}
                            />
                            <div className="text-3xl">📁</div>
                            <div className="text-sm text-white/50 text-center">Clique ou dépose tes fichiers ici</div>
                        </div>
                        <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                            {selectedFiles.length === 0 && <div className="text-center text-white/30 text-sm">Aucun fichier</div>}
                            {selectedFiles.map((f, i) => (
                                <div key={i} className="flex items-center justify-between bg-[#1a1a28] p-2 rounded-lg text-sm hover:bg-[#232336] transition duration-500">
                                    <div className="truncate max-w-[70%] flex items-center gap-2">📄 {f.name}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-white/40 text-xs">{(f.size / 1024).toFixed(1)} KB</div>
                                        <button onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 cursor-pointer transition duration-500">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setSettings(s => ({ ...s, files: false }))} className="w-1/2 bg-white/10 hover:bg-white/20 cursor-pointer transition duration-500 py-2 rounded-xl text-sm">Annuler</button>
                            <button onClick={() => setSettings(s => ({ ...s, files: false }))} className="w-1/2 bg-green-600 hover:bg-green-500 cursor-pointer transition duration-500 py-2 rounded-xl text-sm font-medium">Valider</button>
                        </div>
                    </div>
                </div>
            )}

            {settings.flags && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div className="bg-[#1e1e2f] p-6 rounded-2xl w-[720px] text-white shadow-2xl space-y-5 border border-white/10">

                        <div className="text-center space-y-1">
                            <h2 className="text-xl font-bold">Création d’un flag</h2>
                            <p className="text-white/40 text-xs">Configure précisément la validation du challenge</p>
                        </div>

                        <div className="bg-[#2a2a3d] px-3 py-2 rounded-lg text-xs text-white/60">
                            Format attendu : <span className="text-orange-400 font-semibold">Prénom_Nom</span>
                        </div>

                        <div className="space-y-2">

                            <div className="grid grid-cols-2 gap-2">
                                <input className="p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Titre" value={newFlag.title} onChange={e => setNewFlag({ ...newFlag, title: e.target.value })} />
                                <input className="p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Format (Prénom_Nom)" value={newFlag.flag_format} onChange={e => setNewFlag({ ...newFlag, flag_format: e.target.value })} />
                            </div>

                            <textarea className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500 resize-none h-20" placeholder="Description" value={newFlag.description} onChange={e => setNewFlag({ ...newFlag, description: e.target.value })} />

                            <input className="w-full p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Flag attendu" value={newFlag.flag} onChange={e => setNewFlag({ ...newFlag, flag: e.target.value })} />

                            <div className="grid grid-cols-2 gap-2">
                                <input className="p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Indice" value={newFlag.hint} onChange={e => setNewFlag({ ...newFlag, hint: e.target.value })} />
                                <input className="p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Coût hint" type="number" onChange={e => setNewFlag({ ...newFlag, hint_cost: Number(e.target.value) })} />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <input className="p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Coins" type="number" onChange={e => setNewFlag({ ...newFlag, coin_reward: Number(e.target.value) })} />
                                <input className="p-2 bg-[#2a2a3d] rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500" placeholder="Points" type="number" onChange={e => setNewFlag({ ...newFlag, points: Number(e.target.value) })} />
                            </div>

                        </div>

                        <div className="flex gap-2 pt-1">
                            <button onClick={addFlag} className="flex-1 bg-green-600 hover:bg-green-500 transition py-1.5 rounded-lg text-sm font-medium">Ajouter</button>
                            <button onClick={() => setSettings(s => ({ ...s, flags: false }))} className="flex-1 bg-red-600 hover:bg-red-500 transition py-1.5 rounded-lg text-sm font-medium">Fermer</button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}