"use client"

import { useState } from "react"

type InputConfig = {
    display: boolean
    placeholder: string
    type?: "text" | "number"
}

type ModalInputProps = {
    onValidate: (values: { input1?: string; input2?: string }) => void
    input1?: InputConfig
}

export default function ResetPassword({ onValidate }: ModalInputProps) {
    const [value, setValue] = useState({ p1: "", p2: "" })

    const isDisabled = (value.p1.trim() === "" || value.p2.trim() === "" || value.p1 !== value.p2)

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 w-full max-w-md bg-[#212529] border-2 border-white/30 shadow-2xl p-6 animate-fadeIn">

                <h2 className="font-bold text-white w-full text-center font-mono text-[23px]">Password reset</h2>
                <hr className="text-white/40 my-1 w-1/2 m-auto" />

                <div className="flex flex-col items-center gap-2 w-full my-2">
                    <input type="password" placeholder="New password" className="border-2 border-white/40 w-2/3 text-white/80 p-1.5 text-center font-mono" value={value.p1} onChange={(e) => setValue(prev => ({ ...prev, p1: e.target.value }))} />
                    <input type="password" placeholder="Confirm password" className="border-2 border-white/40 w-2/3 text-white/80 p-1.5 text-center font-mono" value={value.p2} onChange={(e) => setValue(prev => ({ ...prev, p2: e.target.value }))} />
                </div>

                <button disabled={isDisabled} onClick={() => !isDisabled && onValidate({ input1: value.p1, input2: value.p2 })} className={`${!isDisabled ? "cursor-pointer" : "cursor-not-allowed"} border-2 border-white/40 w-2/3 text-white/80 p-1.5 hover:bg-white/20 transition duration-500 cursor-pointer font-mono`}>SEND</button>
            </div>
        </div>
    )
}