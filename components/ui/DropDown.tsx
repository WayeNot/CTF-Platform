import { Option } from "@/lib/types";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";

type BaseProps = {
    label: string;
    isOpen: boolean;
    options: Option[];
    onToggle: () => void;
};

type SingleProps = BaseProps & {
    isOnce: true;
    value: Option | null;
    onSelect: (option: Option) => void;
};

type MultiProps = BaseProps & {
    isOnce: false;
    value: Option[];
    onSelect: (option: Option) => void;
};

type DropDownProps = SingleProps | MultiProps;

export default function DropDown(props: DropDownProps) {
    const { label, isOpen, options, onToggle, onSelect, isOnce } = props;

    const selected: Option[] = isOnce ? props.value ? [props.value] : [] : props.value;

    const selectedSet = new Set(selected.map(v => v.value));

    return (
        <div className="w-full relative h-full">
            <button onClick={onToggle} className={`w-full h-10.5 flex items-center justify-between gap-5 px-2 rounded-lg border text-xs transition duration-300 cursor-pointer ${selected.length ? "border-green-500/30 text-white" : "border-white/10 text-white/60"} hover:border-white/30 hover:text-white bg-[#232336]`}>
                <div className="flex items-center gap-2 overflow-hidden"><span className="flex items-center gap-2 truncate">{label} : {isOnce ? (<span className={`text-[12px] px-2 py-0.5 rounded-full bg-green-500/10 truncate ${props.value?.color || "text-white/70"}`}>{props.value?.label || "Non choisi"}</span>) : (<span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-300">{selected.length}</span>)}</span></div>
                {isOpen ? <IoIosArrowDropupCircle className="text-[16px] shrink-0" /> : <IoIosArrowDropdownCircle className="text-[16px] shrink-0" />}
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-full bg-[#151522] border border-white/10 rounded-xl p-2 flex flex-wrap gap-2 z-50 shadow-2xl max-h-52 overflow-y-auto">
                    {options.map(option => {
                        const isActive = selectedSet.has(option.value);

                        return (
                            <button key={option.value} onClick={() => onSelect(option)} className={`px-2 py-1 rounded-lg text-xs border transition duration-300 cursor-pointer ${isActive ? "bg-green-500/10 text-green-300 border-green-500/30" : "bg-[#232336] text-white/50 border-transparent hover:bg-[#2e2e44] hover:text-white"}`}>{option.label}</button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}