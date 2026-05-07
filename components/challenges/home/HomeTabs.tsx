import { FaMapPin } from "react-icons/fa";
import { FaFlag } from "react-icons/fa6";


export default function HomeTabs({ tab, setTab }: any) {
    return (
        <div>
            <div className="flex items-center justify-center gap-2">
                <hr className="text-white/40 w-full"/>
                <button onClick={() => setTab(0)} className={`flex ml-10 mr-6 items-center gap-4 px-4 py-2 text-sm text-[20px] border transition duration-500 cursor-pointer font-mono ${tab === 0 ? "bg-[#212529] text-white/40 text-white/40" : "bg-[#212529] text-white/40 border-white/10"}`}><FaFlag />CTF</button>
                <button onClick={() => setTab(1)} className={`flex mr-10 items-center gap-4 px-4 py-2 text-sm text-[20px] border transition duration-500 cursor-pointer font-mono ${tab === 1 ? "bg-[#212529] text-white/40 text-white/40" : "bg-[#212529] text-white/40 border-white/10"}`}><FaMapPin /> GEOINT</button>
                <hr className="text-white/40 w-full m-auto"/>
            </div>
        </div>
    );
}