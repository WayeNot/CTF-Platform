import { create } from "zustand";
import { Roles, Status, UserRoles } from "@/lib/types";

interface Warn {
    id: number;
    type: string;
    reason: string;
    duration: number;
    created_at: string;
    user_id: number;
    staff_id: number;
    show_notif: boolean;
}

type NavState = {
    isGuest: boolean;
    user_id: number;
    username: string;
    public_username: string;
    mail: string;
    bio: string;
    role: Roles[];
    pp_url: string;
    status: Status;
    coins: number;
    points: number;
    inMaintenance: boolean;
    reset_password: boolean;
    warn: Warn | null;
    permissions: string[];

    updateIsGuest: (v: boolean) => void;
    updateUserId: (v: number) => void;
    updateUsername: (v: string) => void;
    updatePublicUsername: (v: string) => void;
    updateMail: (v: string) => void;
    updateBio: (v: string) => void;
    updateRole: (v: Roles[]) => void;
    updatePp_url: (v: string) => void;
    updateStatus: (v: Status) => void;
    updateCoins: (v: number) => void;
    updatePoints: (v: number) => void;
    updateInMaintenance: (v: boolean) => void;
    updateResetPassword: (v: boolean) => void;
    updateWarn: (v: Warn | null) => void;
    updatePermissions: (v: string[]) => void;
};

export const useNavData = create<NavState>((set) => ({
    isGuest: false,
    user_id: -1,
    username: "",
    public_username: "",
    mail: "",
    bio: "",
    role: [],
    pp_url: "",
    status: "offline",
    coins: 0,
    points: 0,
    inMaintenance: false,
    reset_password: false,
    warn: null,
    permissions: [],

    updateIsGuest: (v) => set({ isGuest: v }),
    updateUserId: (v) => set({ user_id: v }),
    updateUsername: (v) => set({ username: v }),
    updatePublicUsername: (v) => set({ public_username: v }),
    updateMail: (v) => set({ mail: v }),
    updateBio: (v) => set({ bio: v }),
    updateRole: (v: Roles[]) => set({ role: v }),
    updatePp_url: (v) => set({ pp_url: v }),
    updateStatus: (v) => set({ status: v }),
    updateCoins: (v) => set({ coins: v }),
    updatePoints: (v) => set({ points: v }),
    updateInMaintenance: (v) => set({ inMaintenance: v }),
    updateResetPassword: (v) => set({ reset_password: v }),
    updateWarn: (v) => set({ warn: v }),
    updatePermissions: (v) => set({ permissions: v }),
}));