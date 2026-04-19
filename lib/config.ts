import { Role, Status } from "./types";

export const staff_role = ["owner", "admin", "dev"];
export const maitenance_role: Role[] = ["owner", "admin", "dev", "contributor"];

export const public_routes = [
    "/home",
    "/accounts/login",
    "/accounts/register",
    "/dev/maintenance",
]

export const default_pp = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm0xdXpnYW1vbGZiOXB5cDUweXBic3Z5enJ5b2M3aDN6Ynd5Nzk2dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/adwsEJi5lQRXrgJNWL/giphy.gif"

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