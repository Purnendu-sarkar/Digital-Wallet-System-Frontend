import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Overview = lazy(() => import("@/pages/Admin/Overview"));
const ManageUsers = lazy(() => import("@/pages/Admin/ManageUsers"));
const ManageAgents = lazy(() => import("@/pages/Admin/ManageAgents"));
const Transactions = lazy(() => import("@/pages/Admin/Transactions"));
const Profile = lazy(() => import("@/pages/Admin/Profile"));

export const adminSidebarItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Overview",
                url: "/admin/overview",
                component: Overview,
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                title: "Manage Users",
                url: "/admin/manage-users",
                component: ManageUsers,
            },
            {
                title: "Manage Agents",
                url: "/admin/manage-agents",
                component: ManageAgents,
            },
            {
                title: "Transactions",
                url: "/admin/transactions",
                component: Transactions,
            },
        ],
    },
    {
        title: "Settings",
        items: [
            {
                title: "Profile",
                url: "/admin/profile",
                component: Profile,
            },
        ],
    },
];