export type User = {
    user_id: number
    username: string
    email: string
    password: string
    role: string
    created_at: string
}

export type PatchNote = {
    id: number
    feature: string
    created_at: string
}

export type Features = {
    id: number
    feature: string
}

export type Suggest = {
    id: number
    user_id: number
    suggest: string
    username: string
    created_at: string
}

export type challenges = {
    id: number
    name: string
    slug: string[]
    category: string
    is_public: boolean
}

export type flag_list = {
    title: string
    flag: string
    format: string
    description: string
    indice: string
}

export type guessTheP = {
    id: number
    title: string
    description: string
    image: string
    difficulty: string
    flag: string
    hint: string
    points: number
}