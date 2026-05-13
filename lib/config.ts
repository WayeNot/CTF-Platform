import { Status } from "./types";

export const default_pp = "https://i.giphy.com/adwsEJi5lQRXrgJNWL.webp"

export const default_user = { username: "Invité", status: "online", user_id: Date.now(), role: ["guest"], pp_url: default_pp, password: "", is_online: true, email: "guest@invite.com", coins: 0, points: 0, created_at: "" }

export const owners = [
    { name: "Timéo", linkedin: "https://www.linkedin.com/in/tim%C3%A9o-baffreau-le-roux/" },
    { name: "Aymeric", linkedin: "https://www.linkedin.com/in/aymeric-beaune/" },
];

export const Permissions = {
    contributor: {
        canCreate: {
            ctf: "contributor.canCreate.ctf",
            geoint: "contributor.canCreate.geoint",
        },
    },

    panelAdmin: {
        canOpen: "panelAdmin.canOpen",
        dashboard: "panelAdmin.dashboard",
        manageUser: "panelAdmin.manageUser",
        role: "panelAdmin.role",
        challenges: "panelAdmin.challenges",
        flags: "panelAdmin.flags",
        scoreboard: "panelAdmin.scoreboard",
        announcement: "panelAdmin.announcement",
        settings: "panelAdmin.settings",
        logs: "panelAdmin.logs",
        user: {
            informations: "panelAdmin.user.informations",
            dashboard: "panelAdmin.user.dashboard",
            session: "panelAdmin.user.session",
            sanctions: "panelAdmin.user.sanctions",
            coins: "panelAdmin.user.coins",
            role: "panelAdmin.user.role",
            progression: "panelAdmin.user.progression",
            monitoring: "panelAdmin.user.monitoring",
        }
    },

    advanced: {
        administrator: "advanced.administrator"
    },

    bypass: {
        maintenance: "bypass.maintenance",
    },
} as const

export const maintenance_route = "/dev/maintenance"

export const public_routes = [
    "/",
    "/dev/maintenance",
    "/accounts/login",
    "/accounts/register",
]

export const noGuestRoute = [
    "/challenges/geoint"
];

export const statusColor: Record<Status, string> = {
    online: "border-green-500 border-3",
    donotdisturb: "border-red-500 border-3",
    inactive: "border-yellow-500 border-3",
    offline: "border-gray-500 border-3"
}

export const statusColorHover: Record<Status, string> = {
    online: "border-green-700",
    donotdisturb: "border-red-700",
    inactive: "border-yellow-700",
    offline: "border-gray-700"
}

export const coinManagement = ["100", "500", "1000", "-100", "-500", "-1000"]