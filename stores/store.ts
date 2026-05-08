import { create } from "zustand";
import { Status, Role } from "@/lib/types";

type NavState = {
    isGuest: boolean;
    user_id: number;
    username: string;
    public_username: string;
    email: string;
    role: string[];
    pp_url: string;
    status: Status;
    coins: number;
    points: number;
    inMaintenance: boolean;
    reset_password: boolean

    updateIsGuest: (v: boolean) => void;
    updateUserId: (v: number) => void;
    updateUsername: (v: string) => void;
    updatePublicUsername: (v: string) => void;
    updateEmail: (v: string) => void;
    updateRole: (v: string[]) => void;
    updatePp_url: (v: string) => void;
    updateStatus: (v: Status) => void;
    updateCoins: (v: number) => void;
    updatePoints: (v: number) => void;
    updateInMaintenance: (v: boolean) => void;
    updateResetPassword: (v: boolean) => void;
};

export const useNavData = create<NavState>((set) => ({    
    isGuest: false,
    user_id: -1,
    username: "",
    public_username: "",
    email: "",
    role: [],
    pp_url: "",
    status: "offline",
    coins: 0,
    points: 0,
    inMaintenance: false,
    reset_password: false,

    updateIsGuest: (v) => set({ isGuest: v}),
    updateUserId: (v) => set({ user_id: v}),
    updateUsername: (v) => set({ username: v }),
    updatePublicUsername: (v) => set({ public_username: v }),
    updateEmail: (v) => set({ email: v }),
    updateRole: (v) => set({ role: v }),
    updatePp_url: (v) => set({ pp_url: v }),
    updateStatus: (v) => set({ status: v }),
    updateCoins: (v) => set({ coins: v }),
    updatePoints: (v) => set({ points: v }),
    updateInMaintenance: (v) => set({ inMaintenance: v }),
    updateResetPassword: (v) => set({ reset_password: v }),
}));