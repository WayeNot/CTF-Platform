import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";

type Option = { name: string; color?: string };

type DropDownProps = {
    label: string;
    value: string | string[];
    isOpen: boolean;
    isOnce: boolean;
    options: Option[];
    onToggle: () => void;
    onSelect: (value: string) => void
};

export default function DropDown({ label, value, isOpen, isOnce, options, onToggle, onSelect }: DropDownProps) {
    const selected = Array.isArray(value) ? value : [];
    const selectedSet = new Set(selected);
    const count = selectedSet.size;
    return (
        <div className="w-full relative h-full">
            <button onClick={onToggle} className={`w-full h-10.5 flex items-center justify-between gap-5 px-2 border text-xs transition duration-300 cursor-pointer ${count ? "border-green-500/30 text-white" : "border-white/10 text-white/60"} hover:border-white/30 hover:text-white bg-[#212529]`}>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2">{label} : {count > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-300">{count}</span>}</span>
                    {isOnce && <span className="text-white/80 truncate max-w-30 text-right">{value || "Not chosen"}</span>}
                </div>
                {isOpen ? <IoIosArrowDropupCircle className="text-[16px]" /> : <IoIosArrowDropdownCircle className="text-[16px]" />}
            </button>
            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-full bg-[#363a3f] border border-white/10 p-2 flex flex-wrap gap-2 z-50 shadow-2xl max-h-52 overflow-y-auto">
                    {options.map(el => { const isActive = selectedSet.has(el.name); return (<button key={el.name} onClick={() => onSelect(el.name)} className={`px-2 py-1 text-xs border transition duration-500 cursor-pointer ${isActive ? "bg-green-500/10 text-green-300 border-green-500/30" : "bg-[#212529] text-white/50 border-transparent hover:bg-[#21252970] hover:text-white"}`}>{el.name}</button>) })}
                </div>
            )}
        </div>
    );
}