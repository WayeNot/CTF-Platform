"use client";
import { useEffect, useRef } from "react";
import { GiFire } from "react-icons/gi";

type ModalBoolProps = {
    title: string;
    label: string;
    btn1: string;
    btn2: string;
    subtitle: string;
    onSelect: (value: string) => void;
};

export default function ModalBool({ title, label, btn1, btn2, subtitle, onSelect }: ModalBoolProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "Escape") onSelect(btn2);
        };
        window.addEventListener("keydown", h);
        ref.current?.focus();
        return () => window.removeEventListener("keydown", h);
    }, [btn2, onSelect]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn" onClick={() => onSelect(btn2)}>
            <div ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()} className="relative w-1/4 mx-4 border-2 border-white/30 bg-[#212529] shadow-[0_40px_120px_rgba(0,0,0,0.9)] animate-scaleIn focus:outline-none">
                <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)] opacity-30" />
                <div className="relative flex flex-col items-center text-center px-8 py-9">
                    <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br rounded-full border-2 border-white/30 text-yellow-400 text-2xl shadow-inner mb-6"><GiFire/></div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed w-full">{label}</p>
                    <div className="flex w-full gap-3 mt-8">
                        <button onClick={() => onSelect(btn2)} className="flex-1 py-2.5 border-2 border-white/70 text-white/70 bg-[#212529] text-black font-semibold hover:brightness-200 transition duration-500 cursor-pointer active:scale-95">{btn2}</button>
                        <button onClick={() => onSelect(btn1)} className="flex-1 py-2.5 border-2 border-white/70 text-white/70 bg-[#212529] text-black font-semibold hover:brightness-200 transition duration-500 cursor-pointer active:scale-95">{btn1}</button>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed w-full mt-8 italic">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}