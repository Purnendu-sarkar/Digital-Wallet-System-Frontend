import * as React from "react";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
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
  const meta = data?.meta || { page: 1, limit: 10, total: 0 };


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

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  console.log(users);
  console.log("meta:", meta);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
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
              <SelectItem value="All">All</SelectItem>
              <SelectItem value={role.user}>User</SelectItem>
              <SelectItem value={role.agent}>Agent</SelectItem>
              <SelectItem value={role.admin}>Admin</SelectItem>
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
