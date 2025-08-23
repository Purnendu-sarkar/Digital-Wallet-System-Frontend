/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"; // ধরে নেয়া auth API
import type { TRole } from "@/types";
import { Navigate } from "react-router-dom";

export const withAuth = (
  Component: React.ComponentType,
  requiredRole?: TRole
) => {
  return function ProtectedComponent(props: any) {
    const { data: userData, isLoading } = useUserInfoQuery(undefined);

    if (isLoading) return <div>Loading...</div>; // Skeleton loader ADDED Future

    if (!userData) return <Navigate to="/login" />;

    if (requiredRole && userData.data.role !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component {...props} />;
  };
};
