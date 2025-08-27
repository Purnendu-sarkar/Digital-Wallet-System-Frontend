import * as React from "react";
import { useGetAllTransactionsQuery } from "@/redux/features/transaction/transactionApi";
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
import type { ColumnDef, PaginationState, Updater } from "@tanstack/react-table";
import type { ITransaction } from "@/redux/features/transaction/transactionApi";
import { DataTable } from "@/components/ui/data-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const columns: ColumnDef<ITransaction>[] = [
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `৳${row.original.amount.toFixed(2)}`,
  },
  {
    accessorKey: "commission",
    header: "Commission",
    cell: ({ row }) => `৳${row.original.commission?.toFixed(2) || "0.00"}`,
  },
  { accessorFn: (row) => row.sender?.name || "N/A", header: "Sender" },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "createdAt",
    header: "Time",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleTimeString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.original.status === "SUCCESS"
            ? "bg-green-100 text-green-800"
            : row.original.status === "PENDING"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
];

export default function WithdrawMoney() {
  const [queryParams, setQueryParams] = React.useState({
    page: 1,
    limit: 10,
    searchTerm: "",
    type: "CASH_OUT",
    status: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  const { data, isLoading, isError } = useGetAllTransactionsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const transactions = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1, totalCommission: 0 };

  const handlePagination = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({ ...prev, searchTerm: e.target.value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setQueryParams((prev) => ({ ...prev, status: value === "ALL" ? "" : value, page: 1 }));
  };

  const handleMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({ ...prev, minAmount: e.target.value, page: 1 }));
  };

  const handleMaxAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({ ...prev, maxAmount: e.target.value, page: 1 }));
  };

  const handleStartDate = (date: Date | null) => {
    setQueryParams((prev) => ({
      ...prev,
      startDate: date ? date.toISOString().split("T")[0] : "",
      page: 1,
    }));
  };

  const handleEndDate = (date: Date | null) => {
    setQueryParams((prev) => ({
      ...prev,
      endDate: date ? date.toISOString().split("T")[0] : "",
      page: 1,
    }));
  };

  const handleLimitChange = (value: string) => {
    setQueryParams((prev) => ({ ...prev, limit: Number(value), page: 1 }));
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-lg" />;
  }

  if (isError) {
    return (
      <Card className="mx-auto max-w-7xl">
        <CardHeader>
          <CardTitle>Cash-Out Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">Failed to load cash-out transactions. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto container">
      <CardHeader>
        <CardTitle>Cash-Out Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total: {meta.total} | Commission: ৳{meta.totalCommission?.toFixed(2) || "0.00"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4 flex-wrap gap-y-4">
          <Input
            placeholder="Search by ID or keyword..."
            value={queryParams.searchTerm}
            onChange={handleSearch}
            className="max-w-xs"
          />
          <Select onValueChange={handleStatusFilter} value={queryParams.status}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min Amount"
            value={queryParams.minAmount}
            onChange={handleMinAmount}
            className="w-28"
          />
          <Input
            type="number"
            placeholder="Max Amount"
            value={queryParams.maxAmount}
            onChange={handleMaxAmount}
            className="w-28"
          />
          <DatePicker
            selected={queryParams.startDate ? new Date(queryParams.startDate) : null}
            onChange={handleStartDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="Start Date"
            className="border p-2 rounded w-36 text-sm"
          />
          <DatePicker
            selected={queryParams.endDate ? new Date(queryParams.endDate) : null}
            onChange={handleEndDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="End Date"
            className="border p-2 rounded w-36 text-sm"
          />
          <Select onValueChange={handleLimitChange} value={queryParams.limit.toString()}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={columns}
          data={transactions}
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