"use client";
import { useEffect, useRef } from "react";
import { FaHandsHelping } from "react-icons/fa";

type ModalTextProps = {
    title: string;
    label: string;
    btn: string;
    onSelect: () => void;
};

export default function ModalText({ title, label, btn, onSelect }: ModalTextProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "Escape") onSelect();
        };
        window.addEventListener("keydown", h);
        ref.current?.focus();
        return () => window.removeEventListener("keydown", h);
    }, [btn, onSelect]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn" onClick={() => onSelect()}>
            <div ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()} className="relative w-1/4 mx-4 border-2 border-white/30 bg-[#212529] shadow-[0_40px_120px_rgba(0,0,0,0.9)] animate-scaleIn focus:outline-none">
                <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)] opacity-30" />
                <div className="relative w-full m-auto flex flex-col items-center text-center px-8 py-9">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full  border-2 border-white/30 text-yellow-400 text-2xl shadow-inner mb-6"><FaHandsHelping /></div>
                    <h2 className="text-2xl font-mono font-bold tracking-tight text-white w-full">{title}</h2>
                    <p className="text-sm text-gray-400 mt-3 font-mono leading-relaxed w-2/3">{label}</p>
                    <button onClick={() => onSelect()} className="mt-8 w-full flex-1 font-mono py-2.5 border-2 border-white/30 bg-white/5 text-gray-300 hover:bg-white/30 hover:text-white transition duration-500 cursor-pointer">{btn}</button>
                </div>
            </div>
        </div>
    );
}