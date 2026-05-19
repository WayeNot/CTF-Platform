"use client";
import { useEffect, useRef } from "react";
import { GiFire } from "react-icons/gi";

type ModalBoolProps = {
    title: string;
    label: string;
    subtitle: string;
    onSelect: (value: boolean) => void;
};

export default function ModalBool({ title, label, subtitle, onSelect }: ModalBoolProps) {
    const ref = useRef<HTMLDivElement>(null);  

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn">
            <div className="relative w-fit px-15 py-5 mx-4 border-2 border-white/30 bg-[#212529] shadow-[0_40px_120px_rgba(0,0,0,0.9)] animate-scaleIn focus:outline-none">
                <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)] opacity-30" />
                <div className="relative flex flex-col items-center text-center px-8 my-5">
                    <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br rounded-full border-2 border-white/30 text-yellow-400 text-2xl shadow-inner mb-6"><GiFire/></div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed w-full">{label}</p>
                    <div className="flex w-full gap-3 my-3">
                        <button onClick={() => onSelect(false)} className="flex-1 py-2 border-2 border-white/70 text-white/70 bg-[#212529] font-semibold hover:brightness-200 transition duration-500 cursor-pointer active:scale-95">False</button>
                        <button onClick={() => onSelect(true)} className="flex-1 border-2 border-white/70 text-white/70 bg-[#212529] font-semibold hover:brightness-200 transition duration-500 cursor-pointer active:scale-95">True</button>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed w-full italic">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}