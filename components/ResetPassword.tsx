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
    const [value1, setValue1] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const isDisabled = (value1.trim() === "" || value1 !== confirmPassword)

    return (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 w-full max-w-md bg-[#1e1e2f] border border-gray-700 rounded-2xl shadow-2xl p-6 animate-fadeIn">

                <h2 className="text-[18px] font-bold text-white w-full text-center">Réinitialisation de mot de passe</h2>
                <hr className="text-white/40 my-1 w-1/2 m-auto" />

                <input type="password" placeholder="Nouveau mot de passe" className="border-2 border-white/40 rounded-lg w-2/3 text-white/80 p-1.5 text-center" value={value1} onChange={(e) => setValue1(e.target.value)} />
                <input type="password" placeholder="Confirmer le mot de passe" className="border-2 border-white/40 rounded-lg w-2/3 text-white/80 p-1.5 text-center" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                {isDisabled && confirmPassword.length > 0 && <p>Vous devez rentrer le même mot de passe !</p>}
                <button disabled={isDisabled} onClick={() => !isDisabled && onValidate({ input1: value1 })} className={`${!isDisabled ? "cursor-pointer" : "cursor-not-allowed"} border-2 border-white/40 rounded-lg w-2/3 text-white/80 p-1.5 hover:bg-green-700 transition duration-500 cursor-pointer`}>Valider</button>
            </div>
        </div>
    )
}