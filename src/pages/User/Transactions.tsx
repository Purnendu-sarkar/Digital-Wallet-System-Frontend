/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useDeferredValue, memo, useRef, useEffect, useMemo } from "react";
import { useGetAllTransactionsQuery, type ITransaction } from "@/redux/features/transaction/transactionApi";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import type {
  ColumnDef,
  PaginationState,
  Updater,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import {
  CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  ArrowUpCircle,
  ArrowDownCircle,
  Repeat,
  Search,
  AlertCircle,
  RefreshCw,
  X,
  ArrowLeftRight,
  Wallet,
} from "lucide-react";

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const TransactionTypeCell = memo(function TransactionTypeCell({ tx, currentUserId }: { tx: ITransaction; currentUserId?: string }) {
  const isSender = tx.sender?._id === currentUserId;
  const isReceiver = tx.receiver?._id === currentUserId;

  const config: Record<string, { icon: any; label: string; color: string; bg: string }> = {
    TOP_UP: {
      icon: ArrowDownCircle,
      label: "Top Up",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    WITHDRAW: {
      icon: ArrowUpCircle,
      label: "Withdraw",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    SEND_MONEY: {
      icon: isSender ? ArrowUpRight : isReceiver ? ArrowDownRight : Send,
      label: isSender ? "Sent" : isReceiver ? "Received" : "Send Money",
      color: isSender ? "text-red-500" : isReceiver ? "text-green-500" : "text-muted-foreground",
      bg: isSender ? "bg-red-500/10" : isReceiver ? "bg-green-500/10" : "bg-muted",
    },
    CASH_IN: {
      icon: ArrowDownCircle,
      label: "Cash In",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    CASH_OUT: {
      icon: ArrowUpCircle,
      label: "Cash Out",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  };

  const c = config[tx.type] || { icon: Repeat, label: tx.type, color: "text-muted-foreground", bg: "bg-muted" };
  const Icon = c.icon;

  return (
    <div className="flex items-center gap-2.5">
      <div className={`p-1.5 rounded-full ${c.bg}`}>
        <Icon className={`w-3.5 h-3.5 ${c.color}`} />
      </div>
      <span className="text-sm font-medium">{c.label}</span>
    </div>
  );
});

const AmountCell = memo(function AmountCell({ tx, currentUserId }: { tx: ITransaction; currentUserId?: string }) {
  const isSender = tx.sender?._id === currentUserId;
  const isReceiver = tx.receiver?._id === currentUserId;
  const isAgent = tx.agent?._id === currentUserId;

  let sign = "";
  let color = "text-foreground";

  if (tx.type === "TOP_UP" || tx.type === "CASH_IN") {
    sign = "+";
    color = "text-green-500";
  } else if (tx.type === "WITHDRAW" || (tx.type === "CASH_OUT" && !isAgent)) {
    sign = "-";
    color = "text-red-500";
  } else if (tx.type === "SEND_MONEY") {
    if (isSender) { sign = "-"; color = "text-red-500"; }
    else if (isReceiver) { sign = "+"; color = "text-green-500"; }
  }

  return (
    <span className={`text-sm font-semibold tabular-nums ${color}`}>
      {sign}৳ {tx.amount.toFixed(2)}
    </span>
  );
});

const StatusBadgeCell = memo(function StatusBadgeCell({ status }: { status: string }) {
  const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    SUCCESS: { variant: "default", label: "Success" },
    PENDING: { variant: "secondary", label: "Pending" },
    FAILED: { variant: "destructive", label: "Failed" },
  };
  const c = config[status] || { variant: "outline" as const, label: status };
  return (
    <Badge variant={c.variant} className="text-[11px] h-5 px-2 capitalize">
      {c.label}
    </Badge>
  );
});

export default function UserTransactions() {
  const { data: userData } = useUserInfoQuery();
  const currentUserId = userData?.data?._id;

  const [queryParams, setQueryParams] = useState<
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

  const deferredParams = useDeferredValue(queryParams);
  const { data, isLoading, error, isFetching } = useGetAllTransactionsQuery(deferredParams);

  const transactions = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  const handlePagination = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({ ...prev, searchTerm: e.target.value, page: 1 }));
  };

  const handleTypeFilter = (value: string) => {
    setQueryParams((prev) => ({ ...prev, type: value === "ALL" ? "" : value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setQueryParams((prev) => ({ ...prev, status: value === "ALL" ? "" : value, page: 1 }));
  };

  const amountDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMinAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(amountDebounceRef.current);
    amountDebounceRef.current = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, minAmount: e.target.value, page: 1 }));
    }, 300);
  }, []);

  const handleMaxAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(amountDebounceRef.current);
    amountDebounceRef.current = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, maxAmount: e.target.value, page: 1 }));
    }, 300);
  }, []);

  useEffect(() => {
    return () => clearTimeout(amountDebounceRef.current);
  }, []);

  const handleStartDate = (date: Date | undefined) => {
    setQueryParams((prev) => ({ ...prev, startDate: date ? date.toISOString().split("T")[0] : "", page: 1 }));
  };

  const handleEndDate = (date: Date | undefined) => {
    setQueryParams((prev) => ({ ...prev, endDate: date ? date.toISOString().split("T")[0] : "", page: 1 }));
  };

  const handleLimitChange = (value: string) => {
    setQueryParams((prev) => ({ ...prev, limit: Number(value), page: 1 }));
  };

  const resetFilters = () => {
    setQueryParams({
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
  };

  const hasActiveFilters = Object.entries(queryParams).some(
    ([key, value]) => key !== "page" && key !== "limit" && value
  );

  const columns = useMemo((): ColumnDef<ITransaction>[] => [
    {
      id: "type",
      header: "Type",
      cell: ({ row }) => <TransactionTypeCell tx={row.original} currentUserId={currentUserId} />,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <AmountCell tx={row.original} currentUserId={currentUserId} />,
    },
    {
      accessorKey: "fee",
      header: "Fee",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          ৳ {(row.original.fee || 0).toFixed(2)}
        </span>
      ),
    },
    {
      id: "participant",
      header: "From / To",
      cell: ({ row }) => {
        const tx = row.original;
        const isSender = tx.sender?._id === currentUserId;
        const isReceiver = tx.receiver?._id === currentUserId;

        if (tx.type === "SEND_MONEY") {
          if (isSender) {
            return <span className="text-sm">{tx.receiver?.name || "N/A"}</span>;
          } else if (isReceiver) {
            return <span className="text-sm">{tx.sender?.name || "N/A"}</span>;
          }
        }
        if (tx.type === "CASH_IN" || tx.type === "CASH_OUT") {
          return <span className="text-sm">{tx.agent?.name || tx.sender?.name || "N/A"}</span>;
        }
        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
          {format(new Date(row.original.createdAt), "MMM dd, h:mm a")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadgeCell status={row.original.status} />,
    },
  ], [currentUserId]);

  if (isLoading) {
    return (
      <motion.div
        className="p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-lg font-medium">Failed to load transactions</p>
            <p className="text-sm text-muted-foreground">
              There was a problem fetching your transaction history.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10">
            <ArrowLeftRight className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              {meta.total} {meta.total === 1 ? "transaction" : "transactions"} total
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or keyword..."
                  value={queryParams.searchTerm as string}
                  onChange={handleSearch}
                  className="pl-9 h-9"
                />
              </div>
              <Select
                onValueChange={handleTypeFilter}
                value={queryParams.type as string}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="TOP_UP">Top Up</SelectItem>
                  <SelectItem value="SEND_MONEY">Send Money</SelectItem>
                  <SelectItem value="CASH_OUT">Cash Out</SelectItem>
                  <SelectItem value="CASH_IN">Cash In</SelectItem>
                  <SelectItem value="WITHDRAW">Withdraw</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={handleStatusFilter}
                value={queryParams.status as string}
              >
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Min ৳"
                value={queryParams.minAmount as string}
                onChange={handleMinAmount}
                className="w-[100px] h-9"
              />
              <Input
                type="number"
                placeholder="Max ৳"
                value={queryParams.maxAmount as string}
                onChange={handleMaxAmount}
                className="w-[100px] h-9"
              />
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-[110px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                      {queryParams.startDate
                        ? format(new Date(queryParams.startDate as string), "MMM dd, yyyy")
                        : "Start"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        queryParams.startDate
                          ? new Date(queryParams.startDate as string)
                          : undefined
                      }
                      onSelect={handleStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground text-xs">—</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-[110px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                      {queryParams.endDate
                        ? format(new Date(queryParams.endDate as string), "MMM dd, yyyy")
                        : "End"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        queryParams.endDate
                          ? new Date(queryParams.endDate as string)
                          : undefined
                      }
                      onSelect={handleEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Select
                onValueChange={handleLimitChange}
                value={queryParams.limit?.toString()}
              >
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 gap-1">
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50">
          <CardContent className="p-0">
            {isFetching && !isLoading && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground border-b">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Updating...
              </div>
            )}
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="p-3 rounded-full bg-muted mb-4">
                  <Wallet className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  {hasActiveFilters
                    ? "Try adjusting your filters to see more results."
                    : "Your transaction history will appear here once you start using your wallet."}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
