"use client"

import { useState } from "react"

type InputConfig = {
    display: boolean
    placeholder: string
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
    const [value1, setValue1] = useState("")
    const [value2, setValue2] = useState("")

    const isDisabled = (input1?.display && value1.trim() === "") || (input2?.display && value2.trim() === "")

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">

                <h2 className="text-[18px] font-bold text-white w-full text-center">{title}</h2>
                <hr className="text-white/40 my-3 w-1/2 m-auto"/>

                {input1?.display && <input type={input1.type || "text"} placeholder={input1.placeholder} className="border-2 border-white/40 rounded-lg w-2/3 text-white/80 p-1.5 text-center" value={value1} onChange={(e) => setValue1(e.target.value)}/>}

                {input2?.display && <input type={input2.type || "text"} placeholder={input2.placeholder} className="border-2 border-white/40 rounded-lg w-2/3 text-white/80 p-1.5 text-center" value={value2} onChange={(e) => setValue2(e.target.value)}/>}

                <div className="w-2/3 flex items-center gap-2">
                    <button onClick={onClose} className="border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-red-700 transition duration-500 cursor-pointer">Annuler</button>
                    <button disabled={isDisabled} onClick={() => onValidate({ input1: value1, input2: value2 })} className={`${!isDisabled ? "cursor-pointer" : "cursor-not-allowed"} border-2 border-white/40 rounded-lg w-1/2 text-white/80 p-1.5 hover:bg-green-700 transition duration-500 cursor-pointer`}>Valider</button>
                </div>
            </div>
        </div>
    )
}