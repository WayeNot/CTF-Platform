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
    role: Role[]
    created_at: string
    coins: number
    points: number
    pp_url: string
    status: Status
    is_online: boolean
    is_anonymous: boolean
    reset_password: boolean
}

export type UserSessions = {
    session_id: string;
    user_id: number;
    is_active: boolean;
}

export type UserSanctions = {
    id: number;
    type: string;
    reason: string;
    duration: number;
    created_at: string;
    user_id: number;
    staff_id: number;
    show_notif: boolean;
    permanent: boolean;
    expires_at: string;
    is_active: boolean;
}

export type Roles = {
    id: number;
    label: string;
}

export type Permissions = {
    id: number;
    name: string;
    description: string;
}

export type geoint = {
    id: number;
    title: string;
    description: string;
    difficulty: difficulty | "";
    flag_format: string;
    images: string[];
    status: string;
    creator_id: number;
    created_at: string;
    coins?: number;
    points?: number;
}

export type ctf = {
    id: number;
    title: string;
    description: string;
    difficulty: difficulty;
    category: category[];
    flag_format: string;
    files: string[];
    status: string;
    creator_id: number;
    created_at: string;
    coins?: number;
    points?: number;
}

export interface flags {
    id: number;
    challenge_id: number;
    title: string;
    flag: string;
    flag_format: string;
    description: string;
    hint: string;
    hint_cost?: number;
    challenge_type: string;
    coins: number;
    difficulty: string;
    points: number;
    hint_show: boolean;
    found: boolean;
}

// Geoint Builder ↓

export type GeointBuilderState = {
    title: string;
    description: string;
    difficulty: difficulty | "";
    flag_format: string;
    images: string[];
    coins?: number;
    points?: number;
};

// CTF Builder ↓

export type CtfBuilderState = {
    title: string;
    description: string;
    difficulty: difficulty | "";
    category: category[];
    flag_format: string;
    files: File[];
    coins?: number;
    points?: number;
};

export type NewCtfFlag = {
    title: string
    difficulty: difficulty | ""
    description: string
    flag: string
    flag_format: string
    hint: string
    hint_cost?: number
    coins?: number
    points?: number
}