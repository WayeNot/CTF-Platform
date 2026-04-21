import { BiPlusCircle } from "react-icons/bi";
import { staff_role } from "@/lib/config";
import { useCtfBuilderStore } from "@/stores/useCtfBuilderStore";

export default function CreateButtons({ type, role, onGeoOpen }: any) {    
    if (!staff_role.includes(role || "")) return null;

    if (type === "ctf") {
        return (
            <button onClick={() => useCtfBuilderStore.getState().setOpen(true)} className="flex items-center gap-2 px-4 py-3 bg-[#1e1e2f] border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-orange-500/30 transition duration-500 cursor-pointer"><BiPlusCircle className="text-orange-400" />Créer un CTF</button>
        );
    }

    return (
        <button onClick={onGeoOpen} className="flex items-center gap-2 px-4 py-3 bg-[#1e1e2f] border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-orange-500/30 transition duration-500 cursor-pointer"><BiPlusCircle className="text-orange-400" />Créer un GEOINT</button>
    );
}