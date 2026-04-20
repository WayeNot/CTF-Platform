export type Status = "online" | "donotdisturb" | "inactive" | "offline"

export type Role = "owner" | "admin" | "dev" | "contributor" | "user" | "guest"

export type transactions = "flag" | "geoint" | "daily" | "admin" | "penalty" | "shop"

export type difficulty = "Facile" | "Intermédiaire" | "Avancé" | "Expert"
export type category = "Web" | "Crypto" | "Pwn" | "Reverse" | "Forensic" | "OSINT" | "Misc"

export const difficultyBtn = [
    { name: "Facile", color: "text-green-400" },
    { name: "Intermédiaire", color: "text-yellow-400" },
    { name: "Avancé", color: "text-yellow-600" },
    { name: "Expert", color: "text-red-400" },
]

export const categoryBtn = [
    { name: "Web", color: "text-green-400" },
    { name: "Crypto", color: "text-yellow-400" },
    { name: "Pwn", color: "text-yellow-600" },
    { name: "Reverse", color: "text-red-400" },
    { name: "Forensic", color: "text-grey-400" },
    { name: "OSINT", color: "text-blue-400" },
    { name: "Misc", color: "text-indigo-400" },
]

export type User = {
    user_id: number
    username: string
    email: string
    password: string
    role: Role
    created_at: string
    coin: number
    pp_url: string
    status: Status
    is_online: boolean
}

export type flag_geoint = {
    title: string
    flag: string
    format: string
    description: string
    indice: string
}

export type geoint = {
    id: number
    title: string
    description: string
    image: string
    difficulty: difficulty
    flag: string
    hint: string
    points: number
}

export type NewCtfFlag = {
    title: string
    description: string
    flag: string
    format: string
    hint: string
    hint_cost?: number
}

export type ctf = {
    id: number
    title: string
    description: string
    difficulty: difficulty
    category: category[]
    flag_format: string
    files: string[]
    is_public: boolean
    creator_id: number
    created_at: string
}

export interface ctf_flags {
    id: number;
    ctf_id: number;
    title: string;
    flag: string;
    flag_format: string;
    description: string;
    hint: string;
    hint_cost?: number
    found: boolean
}