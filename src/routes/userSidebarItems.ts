import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Overview = lazy(() => import("@/pages/User/Overview"));
const Deposit = lazy(() => import("@/pages/User/Deposit"));
const Withdraw = lazy(() => import("@/pages/User/Withdraw"));
const SendMoney = lazy(() => import("@/pages/User/SendMoney"));
const Transactions = lazy(() => import("@/pages/User/Transactions"));
const Profile = lazy(() => import("@/pages/User/Profile"));

export const userSidebarItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Overview",
                url: "/user/overview",
                component: Overview,
            },
        ],
    },
    {
        title: "Operations",
        items: [
            {
                title: "Deposit",
                url: "/user/deposit",
                component: Deposit,
            },
            {
                title: "Withdraw",
                url: "/user/withdraw",
                component: Withdraw,
            },
            {
                title: "Send Money",
                url: "/user/send-money",
                component: SendMoney,
            },
            {
                title: "Transactions",
                url: "/user/transactions",
                component: Transactions,
            },
        ],
    },
    {
        title: "Settings",
        items: [
            {
                title: "Profile",
                url: "/user/profile",
                component: Profile,
            },
        ],
    },
];