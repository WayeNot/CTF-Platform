"use client"

import { useState } from "react"
import { useNotif } from "./NotifProvider";

type InputConfig = {
    display: boolean
    placeholder?: string
    type?: "text" | "number"
}

type ModalInputProps = {
    title: string
    onClose: () => void
    onValidate: (values: { input1?: string; input2?: string }) => void

    input1?: InputConfig
    input2?: InputConfig
}

export default function ModalInput({ title, onClose, onValidate, input1, input2 }: ModalInputProps) {
    const { showNotif } = useNotif()

    const [value1, setValue1] = useState("")
    const [value2, setValue2] = useState("")

    const isDisabled = (input1?.display && value1.trim() === "") || (input2?.display && value2.trim() === "")

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn">
            <div onClick={(e) => e.stopPropagation()} className="relative w-fit min-w-1/5 p-5 mx-4 border border-white/10 bg-[linear-gradient(145deg,#1f1f32,#141421)] shadow-[0_40px_120px_rgba(0,0,0,0.9)] animate-scaleIn focus:outline-none">

                <h2 className="text-2xl font-semibold tracking-tight text-white w-full text-center">{title}</h2>
                <hr className="text-white/40 my-5 w-full m-auto" />

                <div className="flex flex-col items-center gap-2">
                    {input1?.display && <input type={input1.type || "text"} placeholder={input1.placeholder} className="text-center w-full flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 active:scale-95" value={value1} onChange={(e) => setValue1(e.target.value)} />}
                    {input2?.display && <input type={input2.type || "text"} placeholder={input2.placeholder} className="text-center w-full flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 active:scale-95" value={value2} onChange={(e) => setValue2(e.target.value)} />}
                </div>

                <div className="w-full flex items-center gap-2 mt-3">
                    <button onClick={onClose} className="w-1/2 flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95">Annuler</button>
                    <button onClick={() => { if (isDisabled) { showNotif("Missing field(s) !"); return; } onValidate({ input1: value1, input2: value2 }); }} className={`${!isDisabled ? "cursor-pointer" : "cursor-not-allowed"} w-1/2 flex-1 py-2.5 border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition duration-500 cursor-pointer active:scale-95"`}>Valider</button>
                </div>
            </div>
        </div>
    )
}