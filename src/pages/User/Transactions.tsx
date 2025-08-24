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
import type {
  ColumnDef,
  PaginationState,
  Updater,
} from "@tanstack/react-table";
import type { ITransaction } from "@/redux/features/transaction/transactionApi";
import { DataTable } from "@/components/ui/data-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const columns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `${row.original.amount.toFixed(2)}`,
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => `${(row.original.fee || 0).toFixed(2)}`,
  },
  {
    accessorFn: (row) => row.sender?.name || "N/A",
    header: "Sender",
  },
  {
    accessorFn: (row) => row.receiver?.name || "N/A",
    header: "Receiver",
  },
  {
    accessorFn: (row) => row.agent?.name || "N/A",
    header: "Agent",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export default function UserTransactions() {
  const [queryParams, setQueryParams] = React.useState<
    Record<string, string | number | undefined>
  >({
    page: 1,
    limit: 10,
    searchTerm: "",
    type: "",
    status: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  const { data, isLoading, error } = useGetAllTransactionsQuery(queryParams);

  const transactions = data?.data || [];
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

  const handleTypeFilter = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      type: value === "ALL" ? "" : value,
      page: 1,
    }));
  };

  const handleStatusFilter = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      status: value === "ALL" ? "" : value,
      page: 1,
    }));
  };

  const handleMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      minAmount: e.target.value,
      page: 1,
    }));
  };

  const handleMaxAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      maxAmount: e.target.value,
      page: 1,
    }));
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
    setQueryParams((prev) => ({
      ...prev,
      limit: Number(value),
      page: 1,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading transactions. Please try again.
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-7xl">
      <CardHeader>
        <CardTitle>Your Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total Transactions: {meta.total}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Input
            placeholder="Search by ID or keyword..."
            value={queryParams.searchTerm as string}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Select
            onValueChange={handleTypeFilter}
            value={queryParams.type as string}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="TOP_UP">Top Up</SelectItem>
              <SelectItem value="WITHDRAW">Withdraw</SelectItem>
              <SelectItem value="SEND_MONEY">Send Money</SelectItem>
              <SelectItem value="CASH_IN">Cash In</SelectItem>
              <SelectItem value="CASH_OUT">Cash Out</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleStatusFilter}
            value={queryParams.status as string}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
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
            value={queryParams.minAmount as string}
            onChange={handleMinAmount}
            className="w-[120px]"
          />
          <Input
            type="number"
            placeholder="Max Amount"
            value={queryParams.maxAmount as string}
            onChange={handleMaxAmount}
            className="w-[120px]"
          />
          <div className="flex items-center gap-2">
            <DatePicker
              selected={
                queryParams.startDate
                  ? new Date(queryParams.startDate as string)
                  : null
              }
              onChange={handleStartDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Start Date"
              className="border p-2 rounded w-[150px]"
            />
            <DatePicker
              selected={
                queryParams.endDate
                  ? new Date(queryParams.endDate as string)
                  : null
              }
              onChange={handleEndDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="End Date"
              className="border p-2 rounded w-[150px]"
            />
          </div>
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
