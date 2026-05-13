export type Status = "online" | "donotdisturb" | "inactive" | "offline"

export type Role = "owner" | "admin" | "dev" | "contributor" | "user" | "guest"

export type transactions = "flag" | "geoint" | "daily" | "admin" | "penalty" | "shop"

export type difficulty = "Facile" | "Intermédiaire" | "Avancé" | "Expert"
export type category = "Web" | "Crypto" | "Pwn" | "Reverse" | "Forensic" | "OSINT" | "Misc"

export interface Option {
    label: string;
    value: string | number;
    color?: string;
};

export const difficultyBtn: Option[] = [
    { label: "Facile", value: "Facile", color: "text-green-400" },
    { label: "Intermédiaire", value: "Intermédiaire", color: "text-yellow-400" },
    { label: "Avancé", value: "Avancé", color: "text-yellow-600" },
    { label: "Expert", value: "Expert", color: "text-red-400" },
];

export const categoryBtn: Option[] = [
    { label: "Web", value: "Web", color: "text-green-400" },
    { label: "Crypto", value: "Crypto", color: "text-yellow-400" },
    { label: "Pwn", value: "Pwn", color: "text-yellow-600" },
    { label: "Reverse", value: "Reverse", color: "text-red-400" },
    { label: "Forensic", value: "Forensic", color: "text-grey-400" },
    { label: "OSINT", value: "OSINT", color: "text-blue-400" },
    { label: "Misc", value: "Misc", color: "text-indigo-400" },
]

export type User = {
    user_id: number;
    username: string;
    bio: string;
    email: string;
    password: string;
    role: Role[];
    created_at: string;
    coins: number;
    points: number;
    pp_url: string;
    status: Status;
    is_online: boolean;
    is_anonymous: boolean;
    reset_password: boolean;
    banner: string;
}

export type UserSessions = {
    session_id: string;
    user_id: number;
    connected_at: string;
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

export type UserTransactions = {
    id: number;
    user_id: number;
    amount: string;
    type: string;
    reference_id: number;
    created_at: string;
    staff_id: number;
    reason: string;
}

export type UserRoles = {
    id: number;
    user_id: number;
    role_id: number;
}

export type UserProgression = {
    id: number;
    title: string;
    difficulty: string;
    category: string[];
    type: string;
    total_flags: number;
    total_flags_found: number;
}

export type Roles = {
    id: number;
    label: string;
    description: string;
    color: string;
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
    difficulty: Option | null;
    flag_format: string;
    images: string[];
    coins?: number;
    points?: number;
};

// CTF Builder ↓

export type CtfBuilderState = {
    title: string;
    description: string;
    difficulty: Option | null;
    category: Option[];
    flag_format: string;
    files: File[];
    coins?: number;
    points?: number;
};

export type NewCtfFlag = {
    title: string;
    difficulty: Option | null;
    description: string;
    flag: string;
    flag_format: string;
    hint: string;
    hint_cost?: number;
    coins?: number;
    points?: number;
};