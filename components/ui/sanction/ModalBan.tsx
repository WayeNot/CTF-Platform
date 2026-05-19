"use client";
import { FaHandsHelping } from "react-icons/fa";
import { PiShieldWarningFill } from "react-icons/pi";

type ModalTextProps = {
    id: number;
    duration: number;
    staff_id: number;
    reason: string;
    expires_at: string;
    onSelect: () => void;
};

export default function ModalBan({ id, duration, staff_id, reason, expires_at, onSelect }: ModalTextProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn" onClick={() => onSelect()}>
            <div onClick={(e) => e.stopPropagation()} className="relative w-1/4 mx-4 border border-white/10 bg-[linear-gradient(145deg,#1f1f32,#141421)] shadow-[0_40px_120px_rgba(0,0,0,0.9)] animate-scaleIn focus:outline-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)] opacity-30"/>
                <div className="relative w-full m-auto flex flex-col items-center text-center px-8 py-9">
                    <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-2xl shadow-inner mb-6"><PiShieldWarningFill size={35}/></div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white w-full">Votre compte a été banni</h2>
                    <div className="flex flex-col items-center my-4 w-full">
                        <p className="text-sm text-gray-400 leading-relaxed w-2/3">Id de la sanction : {id}</p>
                        <p className="text-sm text-gray-400 leading-relaxed w-2/3">Bannissement : {duration === 0 ? "définitif" : `Temporaire ( ${duration} minutes )`}</p>
                        <p className="text-sm text-gray-400 leading-relaxed w-2/3">banni par le staff : {staff_id}</p>
                        <p className="text-sm text-gray-400 leading-relaxed w-2/3">Banni jusqu'à : {new Date(expires_at).toLocaleString()}</p>
                        <p className="text-sm text-gray-400 leading-relaxed w-2/3 max-h-25 overflow-y-auto wrap-break-word">Raison : {reason}</p>
                    </div>
                    <button onClick={() => onSelect()} className="mt-3 w-full flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">I understand perfectly.</button>
                </div>
            </div>
        </div>
    );
}