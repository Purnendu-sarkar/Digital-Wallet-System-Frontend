import * as React from "react";
import {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
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
import type { IUser } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    accessorKey: "agentApprovalStatus",
    header: "Approval Status",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (row.original.isActive ? "Yes" : "No"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
        <Button variant="outline" size="sm" className="text-blue-600">
          Action
        </Button>
      );
    },
  },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-blue-600">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agent Details</DialogTitle>
            </DialogHeader>
            <UserDetails userId={user._id} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

const UserDetails: React.FC<{ userId: string }> = ({ userId }) => {
  const { data, isLoading, error } = useGetUserByIdQuery(userId);

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (error) {
    return <div className="text-red-600">Failed to load agent details</div>;
  }

  const user = data?.data;

  return (
    <div className="space-y-4">
      <div>
        <strong>Name:</strong> {user?.name}
      </div>
      <div>
        <strong>Email:</strong> {user?.email}
      </div>
      <div>
        <strong>Phone:</strong> {user?.phone || "N/A"}
      </div>
      <div>
        <strong>Address:</strong> {user?.address || "N/A"}
      </div>
      <div>
        <strong>Role:</strong> {user?.role}
      </div>
      <div>
        <strong>Active:</strong> {user?.isActive}
      </div>
      <div>
        <strong>Verified:</strong> {user?.isVerified ? "Yes" : "No"}
      </div>
      <div>
        <strong>Wallet Balance:</strong> {user?.wallet?.balance} BDT
      </div>
      <div>
        <strong>Wallet Status:</strong>{" "}
        {user?.wallet?.isBlocked ? "Blocked" : "Active"}
      </div>
      <div>
        <strong>Agent Approval Status:</strong> {user?.agentApprovalStatus}
      </div>
      <div>
        <strong>Authentication Providers:</strong>{" "}
        {user?.auths?.map((auth) => auth.provider).join(", ") || "N/A"}
      </div>
      <div>
        <strong>Created At:</strong>{" "}
        {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
      </div>
      <div>
        <strong>Updated At:</strong>{" "}
        {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
      </div>
    </div>
  );
};

export default function ManageAgents() {
  const [queryParams, setQueryParams] = React.useState<
    Record<string, string | number | undefined>
  >({
    page: 1,
    limit: 10,
    searchTerm: "",
    agentApprovalStatus: "",
    role: "AGENT",
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

  const handleStatusFilter = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
     agentApprovalStatus: value, 
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
        <CardTitle>Manage Agents</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total Agents: {meta.total}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search by name or email..."
            value={queryParams.searchTerm as string}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Select
            onValueChange={handleStatusFilter}
            value={queryParams.agentApprovalStatus as string}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Approval Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
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