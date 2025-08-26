import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLocalStorage } from "react-use";
import {
  Settings,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  List,
} from "lucide-react";
import { useGetAgentOverviewQuery } from "@/redux/features/transaction/transactionApi";
import { Separator } from "@radix-ui/react-select";

const onboardingSteps = [
  {
    title: "Navigation Menu",
    content:
      "Use the navigation menu to switch between sections like Overview, Transactions, and Profile.",
    target: ".nav-menu",
  },
  {
    title: "Stats Cards",
    content:
      "These cards show a quick summary of your total cash-in, cash-out, commissions, and transactions.",
    target: ".stats-cards",
  },
  {
    title: "Transaction Chart",
    content:
      "This chart visualizes your cash-in and cash-out trends for quick insights.",
    target: ".chart-section",
  },
  {
    title: "Recent Activities",
    content:
      "View and filter your recent transactions here. Use the table to track activity details.",
    target: ".table-section",
  },
  {
    title: "Theme Toggle",
    content:
      "Switch between light and dark mode for a comfortable viewing experience.",
    target: ".theme-toggle",
  },
];

const Overview = () => {
  const [filterType, setFilterType] = useState<
    "lifetime" | "last7days" | "last30days"
  >("lifetime");
  const { data, isLoading, error } = useGetAgentOverviewQuery({ filterType });
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage(
    "agentOverviewOnboarding",
    false
  );
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!hasSeenOnboarding);

  // Handle error with Sonner toast
  if (error) {
    toast.error("Failed to load overview data. Please try again.");
  }

  // Handle filter change with toast
  const handleFilterChange = (
    value: "lifetime" | "last7days" | "last30days"
  ) => {
    setFilterType(value);
    toast.success(`Filter changed to ${value}`);
  };

  // Handle onboarding navigation
  const nextStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
      document
        .querySelector(onboardingSteps[onboardingStep + 1].target)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsOnboardingOpen(false);
      setHasSeenOnboarding(true);
    }
  };

  const skipOnboarding = () => {
    setIsOnboardingOpen(false);
    setHasSeenOnboarding(true);
  };

  const chartData = data
    ? [
        { name: "Cash In", value: data.summary.totalCashIn, fill: "#36A2EB" },
        { name: "Cash Out", value: data.summary.totalCashOut, fill: "#FF6384" },
      ]
    : [];
  console.log("Overview Data:", data);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Onboarding Modal */}
      <Dialog
        open={isOnboardingOpen}
        onOpenChange={(open) => !open && skipOnboarding()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{onboardingSteps[onboardingStep].title}</DialogTitle>
          </DialogHeader>
          <p>{onboardingSteps[onboardingStep].content}</p>
          <DialogFooter>
            <Button variant="outline" onClick={skipOnboarding}>
              Skip
            </Button>
            <Button onClick={nextStep}>
              {onboardingStep < onboardingSteps.length - 1 ? "Next" : "Finish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <div className="flex justify-between items-center nav-menu">
        <h2 className="text-2xl font-bold">Agent Dashboard - Overview</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsOnboardingOpen(true);
              setOnboardingStep(0);
            }}
            className="theme-toggle"
          >
            <Settings className="w-4 h-4 mr-2" />
            Restart Tour
          </Button>
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lifetime">Lifetime</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Cash In</CardTitle>
                <ArrowUpCircle className="w-5 h-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.summary.totalCashIn || 0} BDT
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Cash Out</CardTitle>
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.summary.totalCashOut || 0} BDT
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Commission</CardTitle>
                <DollarSign className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.summary.totalCommission || 0} BDT
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Transactions</CardTitle>
                <List className="w-5 h-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.summary.totalTransactions || 0}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : data?.summary ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Section */}
      <div className="table-section">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : data?.recentActivities.length === 0 ? (
              <p className="text-center text-gray-500">
                No recent activities found.
              </p>
            ) : (
              <div className="space-y-4">
                {data?.recentActivities.map((tx, index) => {
                  const isCashIn = tx.type === "CASH_IN";
                  const Icon = isCashIn ? ArrowUpCircle : ArrowDownCircle;
                  const iconColor = isCashIn
                    ? "text-green-500"
                    : "text-red-500";
                  const amountColor = isCashIn
                    ? "text-green-600"
                    : "text-red-600";
                  const amountSign = isCashIn ? "+" : "-";

                  return (
                    <div key={tx._id}>
                      <div className="flex items-center justify-between py-4">
                        {/* Left Icon */}
                        <div className="flex-shrink-0 me-4">
                          <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>

                        {/* Middle Info */}
                        <div className="flex-grow">
                          <p className="font-medium">
                            {tx.type.replace("_", " ")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {isCashIn
                              ? `From: ${tx.receiver?.name || "Unknown"}`
                              : `To: ${tx.sender?.name || "Unknown"}`}
                          </p>
                          <p className="text-xs text-gray-400">
                            Commission: {tx.commission ?? 0} BDT
                          </p>
                        </div>

                        {/* Right Amount + Date */}
                        <div className="text-end flex-shrink-0">
                          <p className={`font-semibold ${amountColor}`}>
                            {amountSign}৳ {tx.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {index < data.recentActivities.length - 1 && (
                        <Separator />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
