/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/assets/icons/digital-wallet.png";
import { Link, useNavigate } from "react-router-dom";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { useUserInfoQuery, useLogoutMutation, authApi } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { toast } from "sonner";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const data = {
    navMain: getSidebarItems(userData?.data?.role),
  };

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(authApi.util.resetApiState());
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");

      setTimeout(() => {
        window.location.reload();
      }, 1);
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="items-start">
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-transparent hover:bg-destructive/10 text-destructive shadow-accent-foreground border-1"
        >
          <LogOutIcon size={16} />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
