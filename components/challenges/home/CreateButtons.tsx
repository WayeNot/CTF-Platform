import { BiPlusCircle } from "react-icons/bi";

export default function CreateButtons({ type, role, onGeoOpen, onCtfOpen }: any) {
    if (type === "ctf") {
        return (
            <div>
                <button onClick={onCtfOpen} className={`flex items-center gap-4 px-4 py-2 text-sm text-[20px] border border-white/10 hover:border-white/40 transition duration-500 cursor-pointer font-mono text-white/40`}><BiPlusCircle className="text-white/40" />Créer un CTF</button>
            </div>
        );
    }
    return (
        <button onClick={onGeoOpen} className={`flex items-center gap-4 px-4 py-2 text-sm text-[20px] border border-white/10 hover:border-white/40 transition duration-500 cursor-pointer font-mono text-white/40`}><BiPlusCircle className="text-white/40" />Créer un GEOINT</button>
    );
}