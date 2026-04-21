import { create } from "zustand";
import { Status, Role } from "@/lib/types";

type NavState = {
    isGuest: boolean;
    username: string;
    email: string;
    role: Role[];
    pp_url: string;
    status: Status;
    coin: number;

    updateIsGuest: (v: boolean) => void;
    updateUsername: (v: string) => void;
    updateEmail: (v: string) => void;
    updateRole: (v: Role[]) => void;
    updatePp_url: (v: string) => void;
    updateStatus: (v: Status) => void;
    updateCoin: (v: number) => void;
};

export const useNavData = create<NavState>((set) => ({
    isGuest: false,
    username: "",
    email: "",
    role: [],
    pp_url: "",
    status: "offline",
    coin: 0,

    updateIsGuest: (v) => set({ isGuest: v}),
    updateUsername: (v) => set({ username: v }),
    updateEmail: (v) => set({ email: v }),
    updateRole: (v) => set({ role: v }),
    updatePp_url: (v) => set({ pp_url: v }),
    updateStatus: (v) => set({ status: v }),
    updateCoin: (v) => set({ coin: v }),
}));