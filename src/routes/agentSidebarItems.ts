import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Overview = lazy(() => import("@/pages/Agent/Overview"));
const AddMoney = lazy(() => import("@/pages/Agent/AddMoney"));
const WithdrawMoney = lazy(() => import("@/pages/Agent/WithdrawMoney"));
const Transactions = lazy(() => import("@/pages/Agent/Transactions"));
const Profile = lazy(() => import("@/pages/Agent/Profile"));

export const agentSidebarItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Overview",
                url: "/agent/overview",
                component: Overview,
            },
        ],
    },
    {
        title: "Operations",
        items: [
            {
                title: "Add Money to User",
                url: "/agent/add-money",
                component: AddMoney,
            },
            {
                title: "Withdraw from User",
                url: "/agent/withdraw-money",
                component: WithdrawMoney,
            },
            {
                title: "Transactions",
                url: "/agent/transactions",
                component: Transactions,
            },
        ],
    },
    {
        title: "Settings",
        items: [
            {
                title: "Profile",
                url: "/agent/profile",
                component: Profile,
            },
        ],
    },
];