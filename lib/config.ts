import { Role, Status } from "./types";

export const owners = [
    { name: "Timéo", linkedin: "https://www.linkedin.com/in/tim%C3%A9o-baffreau-le-roux-511a1a353/" },
    { name: "Romain", linkedin: "https://www.linkedin.com/in/romain-guibert-2851a52bb/" },
    { name: "Aymeric", linkedin: "https://www.linkedin.com/in/aymeric-beaune-9b81b0364/" },
];

export const staff_role = ["owner", "admin", "dev"];
export const maitenance_role: Role[] = ["owner", "admin", "dev", "contributor"];

export const maintenance_route = "/dev/maintenance"

export const public_routes = [
    "/dev/maintenance",
    "/main"
]

export const noGuestRoute = [
    "/challenges/geoint"
];

export const default_pp = "https://i.giphy.com/adwsEJi5lQRXrgJNWL.webp"

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