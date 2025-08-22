import App from "@/App";
import AdminDashboard from "@/components/layout/DashBord/AdminDashboard";
import AgentDashboard from "@/components/layout/DashBord/AgentDashboard";
import UserDashboard from "@/components/layout/DashBord/UserDashboard";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "about",
      },
      {
        Component: UserDashboard,
        path: "user/dashboard",
      },
      {
        Component: AgentDashboard,
        path: "agent/dashboard",
      },
      {
        Component: AdminDashboard,
        path: "admin/dashboard",
      },
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
]);
