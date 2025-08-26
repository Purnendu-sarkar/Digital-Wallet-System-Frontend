/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  useGetAdminStatsQuery,
  useGetAllTransactionsQuery,
  type IStatsQueryParams,
} from "@/redux/features/transaction/transactionApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Users, Activity, DollarSign } from "lucide-react";
import { CustomAreaChart } from "@/components/ui/CustomAreaChart";
import { CustomBarChart } from "@/components/ui/CustomBarChart";
import { CustomPieChart } from "@/components/ui/CustomPieChart";

export default function AdminOverview() {
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("activeTab") || "Users"
  );
  const [filterType, setFilterType] = useState<
    "lifetime" | "last7days" | "last30days" | "custom" | "specificDate"
  >(() => (localStorage.getItem("filterType") as any) || "lifetime");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleFilterChange = (v: string) => {
    setFilterType(v as typeof filterType);
    localStorage.setItem("filterType", v);
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    localStorage.setItem("activeTab", val);
  };

  const params: IStatsQueryParams | undefined = useMemo(() => {
    if (filterType === "lifetime") return undefined;

    const base: IStatsQueryParams = {
      filterType: filterType as IStatsQueryParams["filterType"],
    };

    if (filterType === "custom") {
      return {
        ...base,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      };
    }

    if (filterType === "specificDate" && startDate) {
      return {
        ...base,
        specificDate: format(startDate, "yyyy-MM-dd"),
      } as IStatsQueryParams;
    }

    return base;
  }, [filterType, startDate, endDate]);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetAdminStatsQuery(params);
  const { data: transactionsData, isLoading: txLoading } =
    useGetAllTransactionsQuery({});

  if (statsError) {
    toast.error("Failed to load stats");
  }

  const barChartData = useMemo(() => {
    if (!transactionsData?.data) return [];

    const now = new Date();
    const filteredTx = transactionsData.data.filter((tx: any) => {
      const txDate = new Date(tx.createdAt);

      if (filterType === "custom" && startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return txDate >= start && txDate <= end;
      } else if (filterType === "last7days") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        return txDate >= sevenDaysAgo && txDate <= now;
      } else if (filterType === "last30days") {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        return txDate >= thirtyDaysAgo && txDate <= now;
      } else if (filterType === "specificDate" && startDate) {
        const specific = new Date(startDate);
        specific.setHours(0, 0, 0, 0);
        const specificEnd = new Date(startDate);
        specificEnd.setHours(23, 59, 59, 999);
        return txDate >= specific && txDate <= specificEnd;
      }
      return true;
    });

    const grouped: { [key: string]: any[] } = {};
    filteredTx.forEach((tx: any) => {
      const date = format(new Date(tx.createdAt), "yyyy-MM-dd");
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(tx);
    });

    return Object.entries(grouped).map(([date, txs]) => {
      const transactions = txs.length;
      const volume = txs.reduce((sum, tx) => sum + tx.amount, 0);
      return { date, transactions, volume };
    });
  }, [transactionsData, filterType, startDate, endDate]);

  const areaChartData = useMemo(() => {
    if (!transactionsData?.data) return [];

    const grouped: { [key: string]: any[] } = {};
    transactionsData.data.forEach((tx: any) => {
      const date = format(new Date(tx.createdAt), "yyyy-MM-dd");
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(tx);
    });

    return Object.entries(grouped).map(([date, txs]) => {
      let value = 0;
      if (activeTab === "Volume") {
        value = txs.reduce((sum, tx) => sum + tx.amount, 0);
      } else if (activeTab === "Transactions") {
        value = txs.length;
      } else if (activeTab === "Users") {
        const uniqueUsers = new Set();
        txs.forEach((tx: any) => {
          if (tx.senderId) uniqueUsers.add(tx.senderId);
          if (tx.receiverId) uniqueUsers.add(tx.receiverId);
        });
        value = uniqueUsers.size;
      }
      return { date, value };
    });
  }, [transactionsData, activeTab]);

  return (
    <div className=" bg-gradient-to-b from-background to-secondary/20 space-y-6 p-4 md:p-6">
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={filterType} onValueChange={handleFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lifetime">Lifetime</SelectItem>
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Date</SelectItem>
            <SelectItem value="specificDate">Specific Date</SelectItem>
          </SelectContent>
        </Select>

        {filterType === "custom" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate && endDate
                  ? `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`
                  : "Pick Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="range"
                selected={
                  startDate && endDate
                    ? { from: startDate, to: endDate }
                    : undefined
                }
                onSelect={(range) => {
                  if (range?.from) setStartDate(range.from);
                  if (range?.to) setEndDate(range.to);
                }}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        )}

        {filterType === "specificDate" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Agents
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalAgents || 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transaction Count
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {stats?.transactionCount || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volume
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ৳{stats?.totalTransactionVolume || 0}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs and Charts */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="bg-muted/40 backdrop-blur border border-border rounded-xl">
          <TabsTrigger value="Distribution">Distribution</TabsTrigger>
          <TabsTrigger value="Transactions">Transactions</TabsTrigger>
          <TabsTrigger value="Volume">Volume</TabsTrigger>
        </TabsList>
        <TabsContent value="Distribution">
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle>Users Over Time</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              {txLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <CustomPieChart
                  totalUsers={stats?.totalUsers || 0}
                  totalAgents={stats?.totalAgents || 0}
                  title="User vs Agent Distribution"
                  description="Showing the distribution of users and agents over the selected period"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Transactions">
          {txLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <CustomBarChart
              data={barChartData}
              title="Transactions Over Time"
            />
          )}
        </TabsContent>
        <TabsContent value="Volume">
          {txLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <CustomAreaChart
              data={areaChartData}
              title="Volume Over Time"
              description="Showing total transaction volume over the selected period"
              filterType={filterType}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
