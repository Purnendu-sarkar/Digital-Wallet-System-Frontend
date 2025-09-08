import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";

import { role } from "@/context/constants/role";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import type { TRole } from "@/types";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";

import { createBrowserRouter, Navigate } from "react-router";
import { userSidebarItems } from "./userSidebarItems";
import { agentSidebarItems } from "./agentSidebarItems";
import { adminSidebarItems } from "./adminSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import FAQ from "@/pages/FAQ";
import Features from "@/pages/Features";
import HomePage from "@/pages/HomePage";
import { Contact } from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import BlogPage from "@/pages/BlogPage";
import Payments from "@/pages/Features/Payments";
import Transfers from "@/pages/Features/Transfers";
import Security from "@/pages/Features/Security";
import Automation from "@/pages/Features/Automation";
import Analytics from "@/pages/Features/Analytics";
import Integrations from "@/pages/Features/Integrations";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: HomePage,
        index: true
      },
      {
        Component: About,
        path: "about",
      },
      {
        Component: Contact,
        path: "contact",
      },
      {
        Component: FAQ,
        path: "faq",
      },
      {
        Component: Features,
        path: "features",
      },
      {
        Component: Payments,
        path: "features/payments",
      },
      {
        Component: Transfers,
        path: "features/transfers",
      },
      {
        Component: Security,
        path: "features/security",
      },
      {
        Component: Automation,
        path: "features/automation",
      },
      {
        Component: Analytics,
        path: "features/analytics",
      },
      {
        Component: Integrations,
        path: "features/integrations",
      },
      {
        Component: BlogPage,
        path: "blog",
      },
      {
        Component: BlogPage,
        path: "/blog/:id",
      },
      // {
      //   Component: UserDashboard,
      //   path: "user/dashboard",
      // },
      // {
      //   Component: AgentDashboard,
      //   path: "agent/dashboard",
      // },
      // {
      //   Component: AdminDashboard,
      //   path: "admin/dashboard",
      // },
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.user as TRole),
    path: "/user",
    children: [
      { index: true, element: <Navigate to="/user/overview" /> },
      ...generateRoutes(userSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.agent as TRole),
    path: "/agent",
    children: [
      { index: true, element: <Navigate to="/agent/overview" /> },
      ...generateRoutes(agentSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.admin as TRole),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/overview" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: Verify,
    path: "/verify",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
  {
    Component: NotFound,
    path: "*",
  },
]);
