import { IoMdArrowForward } from "react-icons/io";

export default function ChallengeCard({ title, onClick }: any) {
    return (
        <button onClick={onClick} className="text-center group relative bg-[#212529] border border-white/10 hover:border-white/40 px-4 py-3 text-sm text-white/60 hover:text-white transition duration-500 cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative flex items-center justify-center gap-2">
                <span className="font-mono text-[20px]">{title}</span>
                <IoMdArrowForward className="opacity-40 text-white text-[25px] group-hover:opacity-100 group-hover:translate-x-1 transition duration-500" />
            </div>
        </button>
    );
}