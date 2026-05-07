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
            <div ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()} className="relative w-1/4 mx-4 rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,#1f1f32,#141421)] shadow-[0_40px_120px_rgba(0,0,0,0.9)] animate-scaleIn focus:outline-none">
                <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)] opacity-30" />
                <div className="relative flex flex-col items-center text-center px-8 py-9">
                    <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><GiFire/></div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed w-full">{label}</p>
                    <div className="flex w-full gap-3 mt-8">
                        <button onClick={() => onSelect(btn2)} className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">{btn2}</button>
                        <button onClick={() => onSelect(btn1)} className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-[0_15px_35px_rgba(250,204,21,0.4)] hover:brightness-110 transition duration-500 cursor-pointer active:scale-95">{btn1}</button>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed w-full mt-8 italic">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}