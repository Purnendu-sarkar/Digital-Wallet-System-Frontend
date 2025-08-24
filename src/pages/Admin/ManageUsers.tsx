/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  useBlockUserMutation,
  useGetAllUsersQuery,
  useUnblockUserMutation,
} from "@/redux/features/user/userApi";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ColumnDef,
  PaginationState,
  Updater,
} from "@tanstack/react-table";
import { role } from "@/context/constants/role";
import type { IUser } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (row.original.isActive ? "Yes" : "No"),
  },
  {
  id: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const user = row.original;
    const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
    const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

    const handleBlock = async () => {
      try {
        await blockUser(user._id).unwrap();
        toast.success("Wallet blocked successfully");
      } catch (error) {
        toast.error("Failed to block wallet");
      }
    };

    const handleUnblock = async () => {
      try {
        await unblockUser(user._id).unwrap();
        toast.success("Wallet unblocked successfully");
      } catch (error) {
        toast.error("Failed to unblock wallet");
      }
    };

    return user.wallet?.isBlocked ? (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isUnblocking}
            className="text-green-600"
          >
            Unblock
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unblock the user's wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnblock} disabled={isUnblocking}>
              Unblock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isBlocking}
            className="text-red-600"
          >
            Block
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will block the user's wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock} disabled={isBlocking}>
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
}

];

export default function ManageUsers() {
  const [queryParams, setQueryParams] = React.useState<
    Record<string, string | number | undefined>
  >({
    page: 1,
    limit: 10,
    searchTerm: "",
    role: "",
  });

  const { data, isLoading } = useGetAllUsersQuery(queryParams);

  const users = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  const handlePagination = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      searchTerm: e.target.value,
      page: 1,
    }));
  };

  const handleRoleFilter = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      role: value === "ALL" ? undefined : value,
      page: 1,
    }));
  };

  const handleLimitChange = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      limit: Number(value),
      page: 1,
    }));
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total Users: {meta.total}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search by name, email, or role..."
            value={queryParams.searchTerm as string}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Select
            onValueChange={handleRoleFilter}
            value={queryParams.role as string}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value={role.user}>User</SelectItem>
              <SelectItem value={role.agent}>Agent</SelectItem>
              <SelectItem value={role.admin}>Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleLimitChange}
            value={queryParams.limit.toString()}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={columns}
          data={users}
          pagination={{
            pageIndex: meta.page - 1,
            pageSize: meta.limit,
            total: meta.total,
            onPaginationChange: (updater: Updater<PaginationState>) => {
              const newState =
                typeof updater === "function"
                  ? updater({ pageIndex: meta.page - 1, pageSize: meta.limit })
                  : updater;

              handlePagination(newState.pageIndex + 1);
              setQueryParams((prev) => ({ ...prev, limit: newState.pageSize }));
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
