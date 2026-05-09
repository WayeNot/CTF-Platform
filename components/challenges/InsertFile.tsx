"use client"

import { useState } from "react";
import { difficulty, difficultyBtn, NewCtfFlag } from "@/lib/types";
import { useNotif } from "../NotifProvider";

type InsertFileType = {
    onClose: () => void;
    onSubmit: (files: File[]) => void;
}

export default function InsertFile({ onClose, onSubmit }: InsertFileType) {
    const { showNotif } = useNotif()

    const [files, setFiles] = useState<File[]>([]);

    const canSubmit = files && files.length !== 0

    const handleSubmit = () => {
        onSubmit(files);
        setFiles([]);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#212529] w-140 p-5 text-white shadow-2xl border border-white/10 space-y-4">
                <div className="text-center">
                    <h2 className="text-lg font-bold font-mono">Challenge files</h2>
                    <p className="text-white/40 text-xs font-mono">Drag and drop or select files</p>
                </div>
                <div className="border border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-orange-500 transition duration-500 flex flex-col items-center justify-center gap-2" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const files = Array.from(e.dataTransfer.files || []); setFiles(prev => [...prev, ...files]); }} onClick={() => document.getElementById("fileInput")?.click()}>
                    <input id="fileInput" type="file" multiple className="hidden" onChange={(e) => { const fileInput = e.target.files; if (!fileInput) return; setFiles(prev => [...prev, ...Array.from(fileInput)]); }} />
                    <div className="text-3xl">📁</div>
                    <div className="text-sm text-white/50 text-center">Click or drop your files here</div>
                </div>
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                    {files.length === 0 && <div className="text-center text-white/30 text-sm">No file</div>}
                    {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#1a1a28] p-2 rounded-lg text-sm hover:bg-[#232336] transition duration-500">
                            <div className="truncate max-w-[70%] flex items-center gap-2">📄 {f.name}</div>
                            <div className="flex items-center gap-2">
                                <div className="text-white/40 text-xs">{(f.size / 1024).toFixed(1)} KB</div>
                                <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 cursor-pointer transition duration-500">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs py-2 transition duration-500 cursor-pointer font-mono w-65">Cancel</button>
                    <button disabled={!canSubmit} onClick={handleSubmit} className="bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs py-2 transition duration-500 disabled:opacity-40 cursor-pointer font-mono w-65">Send</button>
                </div>
            </div>
        </div>
    )
}