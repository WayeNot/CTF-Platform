import { Option } from "@/lib/types";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";

type BaseProps<T> = {
    label: string;
    isOpen: boolean;
    options: Option<T>[];
    onToggle: () => void;
};

type SingleProps<T> = BaseProps<T> & {
    isOnce: true;
    value: Option<T> | null;
    onSelect: (option: Option<T>) => void;
};

type MultiProps<T> = BaseProps<T> & {
    isOnce: false;
    value: Option<T>[];
    onSelect: (option: Option<T>) => void;
};

type DropDownProps<T> = SingleProps<T> | MultiProps<T>;

export default function DropDown<T>(props: DropDownProps<T>) {
    const { label, isOpen, options, onToggle, onSelect, isOnce } = props;

    const selected: Option<T>[] = isOnce ? (props.value ? [props.value] : []) : props.value;

    const selectedSet = new Set(selected.map(v => v.value));

    return (
        <div className="w-full relative h-full">
            <button onClick={onToggle} className={`w-full h-10.5 flex items-center justify-between gap-5 px-2 border text-xs transition duration-300 cursor-pointer border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white`}>
                <div className="flex items-center gap-2 overflow-hidden"><span className="flex items-center gap-2 truncate">{label} : {isOnce ? (<span className={`text-[12px] px-2 py-0.5 bg-green-500/10 truncate ${props.value?.color || "text-white/70"}`}>{props.value?.label || "Non choisi"}</span>) : (<span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-300">{selected.length}</span>)}</span></div>
                {isOpen ? <IoIosArrowDropupCircle className="text-[16px] shrink-0" /> : <IoIosArrowDropdownCircle className="text-[16px] shrink-0" />}
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-full bg-[#363a3f] border border-white/10 p-2 flex flex-wrap gap-2 z-50 shadow-2xl max-h-52 overflow-y-auto">
                    {options.map((option, k) => {
                        const isActive = selectedSet.has(option.value);

                        return (
                            <button key={k} onClick={() => onSelect(option)} className={`px-2 py-1  text-xs border transition duration-300 cursor-pointer ${isActive ? "bg-green-500/10 text-green-300 border-green-500/30" : "bg-[#212529] text-white/50 border-transparent hover:brightness-150 hover:text-white"}`}>{option.label}</button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}