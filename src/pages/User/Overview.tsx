/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, useState, useMemo } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {
  useGetAllTransactionsQuery,
  type ITransaction,
} from "@/redux/features/transaction/transactionApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProfileCompletionCard from "./components/ProfileCompletionCard";
import SecurityStatusCard from "./components/SecurityStatusCard";
import { useLocalStorage } from "react-use";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Send,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  ShieldAlert,
  CreditCard,
  Repeat,
  CalendarDays,
  ChevronRight,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
} from "lucide-react";
import { format } from "date-fns";

const QuickSendMoney = lazy(() => import("./QuickSendMoney"));
const QuickCashOut = lazy(() => import("./QuickCashOut"));

const onboardingSteps = [
  {
    title: "Dashboard Overview",
    content:
      "Welcome to your upgraded dashboard! Here you can see your balance, quick actions, and recent transactions at a glance.",
    target: ".dashboard-header",
  },
  {
    title: "Wallet Balance",
    content:
      "Your premium wallet card shows your current balance with today's earnings and expenses.",
    target: ".wallet-balance-card",
  },
  {
    title: "Quick Actions",
    content:
      "Use these shortcuts to quickly send money or cash out without navigating to other pages.",
    target: ".quick-actions-grid",
  },
  {
    title: "Statistics",
    content:
      "Track your financial activity with real-time statistics including total sent, received, and transaction count.",
    target: ".stats-section",
  },
  {
    title: "Recent Transactions",
    content:
      "View your latest transactions with enhanced details, status indicators, and quick access.",
    target: ".recent-transactions-section",
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function getTransactionDetails(tx: ITransaction, currentUserId?: string) {
  let IconComponent: any;
  let iconColor = "text-muted-foreground";
  let bgColor = "bg-muted";
  let amountSign = "";
  let amountColor = "text-foreground";
  let details = "";
  let statusColor: "default" | "secondary" | "destructive" | "outline" = "default";

  const isSender = tx.sender?._id === currentUserId;
  const isReceiver = tx.receiver?._id === currentUserId;

  switch (tx.type) {
    case "TOP_UP":
      IconComponent = ArrowDownCircle;
      iconColor = "text-green-500";
      bgColor = "bg-green-500/10";
      amountSign = "+";
      amountColor = "text-green-500";
      details = "Wallet Top Up";
      break;
    case "WITHDRAW":
      IconComponent = ArrowUpCircle;
      iconColor = "text-red-500";
      bgColor = "bg-red-500/10";
      amountSign = "-";
      amountColor = "text-red-500";
      details = "Wallet Withdrawal";
      break;
    case "SEND_MONEY":
      if (isSender) {
        IconComponent = ArrowUpRight;
        iconColor = "text-red-500";
        bgColor = "bg-red-500/10";
        amountSign = "-";
        amountColor = "text-red-500";
        details = `To ${tx.receiver?.name || tx.receiver?.email || "N/A"}`;
      } else if (isReceiver) {
        IconComponent = ArrowDownRight;
        iconColor = "text-green-500";
        bgColor = "bg-green-500/10";
        amountSign = "+";
        amountColor = "text-green-500";
        details = `From ${tx.sender?.name || tx.sender?.email || "N/A"}`;
      } else {
        IconComponent = Send;
        details = "Unknown";
      }
      break;
    case "CASH_IN":
      IconComponent = ArrowDownCircle;
      iconColor = "text-green-500";
      bgColor = "bg-green-500/10";
      amountSign = "+";
      amountColor = "text-green-500";
      details = `Cash In via ${tx.agent?.name || tx.agent?.email || "Agent"}`;
      break;
    case "CASH_OUT":
      IconComponent = ArrowUpCircle;
      iconColor = "text-red-500";
      bgColor = "bg-red-500/10";
      amountSign = "-";
      amountColor = "text-red-500";
      details = `Cash Out via ${tx.agent?.name || tx.agent?.email || "Agent"}`;
      break;
    default:
      IconComponent = Repeat;
      details = "Unknown";
  }

  switch (tx.status) {
    case "SUCCESS":
      statusColor = "default";
      break;
    case "PENDING":
      statusColor = "secondary";
      break;
    case "FAILED":
      statusColor = "destructive";
      break;
  }

  return { IconComponent, iconColor, bgColor, amountSign, amountColor, details, statusColor };
}

export default function Overview() {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useUserInfoQuery();

  const {
    data: transactionsData,
    isLoading: txLoading,
    error: txError,
  } = useGetAllTransactionsQuery({
    limit: 10,
    page: 1,
  });

  const user = userData?.data;
  const balance = user?.wallet?.balance || 0;
  const currentUserId = user?._id;

  const transactions = useMemo(
    () =>
      [...(transactionsData?.data || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [transactionsData]
  );

  const recentTransactions = transactions.slice(0, 10);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayTransactions = useMemo(
    () => transactions.filter((tx) => new Date(tx.createdAt) >= todayStart),
    [transactions, todayStart]
  );

  const stats = useMemo(() => {
    let totalSent = 0;
    let totalReceived = 0;
    let totalFees = 0;
    let pendingCount = 0;

    transactions.forEach((tx) => {
      if (tx.sender?._id === currentUserId) {
        totalSent += tx.amount;
      }
      if (tx.receiver?._id === currentUserId) {
        totalReceived += tx.amount;
      }
      totalFees += tx.fee || 0;
      if (tx.status === "PENDING") pendingCount++;
    });

    const todayIncome = todayTransactions
      .filter((tx) => tx.receiver?._id === currentUserId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const todayExpense = todayTransactions
      .filter((tx) => tx.sender?._id === currentUserId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { totalSent, totalReceived, totalFees, pendingCount, todayIncome, todayExpense };
  }, [transactions, currentUserId, todayTransactions]);

  const recentReceivers = useMemo(
    () =>
      Array.from(
        transactions
          .filter((tx) => tx.type === "SEND_MONEY" && tx.sender?._id === currentUserId)
          .reduce((map, tx) => {
            if (tx.receiver && !map.has(tx.receiver._id))
              map.set(tx.receiver._id, tx.receiver);
            return map;
          }, new Map<string, any>())
          .values()
      ).slice(0, 5),
    [transactions, currentUserId]
  );

  const recentAgents = useMemo(
    () =>
      Array.from(
        transactions
          .filter((tx) => tx.type === "CASH_OUT" && tx.sender?._id === currentUserId)
          .reduce((map, tx) => {
            if (tx.agent && !map.has(tx.agent._id)) map.set(tx.agent._id, tx.agent);
            return map;
          }, new Map<string, any>())
          .values()
      ).slice(0, 5),
    [transactions, currentUserId]
  );

  const [sendOpen, setSendOpen] = useState(false);
  const [cashOutOpen, setCashOutOpen] = useState(false);

  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage(
    "userOverviewOnboarding",
    false
  );
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!hasSeenOnboarding);

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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  if (userLoading || txLoading) {
    return (
      <motion.div
        className="p-4 md:p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </motion.div>
    );
  }

  if (userError || txError) {
    return (
      <div className="p-6">
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <ShieldAlert className="w-12 h-12 text-destructive" />
            <p className="text-lg font-medium">Failed to load dashboard</p>
            <p className="text-sm text-muted-foreground">
              There was a problem loading your data. Please try again.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Onboarding Dialog */}
      <Dialog
        open={isOnboardingOpen}
        onOpenChange={(open) => !open && skipOnboarding()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{onboardingSteps[onboardingStep].title}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">{onboardingSteps[onboardingStep].content}</p>
          <DialogFooter>
            <Button variant="outline" onClick={skipOnboarding}>
              Skip
            </Button>
            <Button onClick={nextStep}>
              {onboardingStep < onboardingSteps.length - 1 ? "Next" : "Get Started"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dashboard Header */}
      <motion.div
        className="dashboard-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {greeting}, {user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsOnboardingOpen(true);
              setOnboardingStep(0);
            }}
            className="text-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
            Tour Guide
          </Button>
        </div>
      </motion.div>

      {/* Premium Wallet Balance Card */}
      <motion.div variants={itemVariants} className="wallet-balance-card">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary-foreground)/0.15),transparent_60%)]" />
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-foreground/5 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-primary-foreground/5 blur-xl" />
          <CardContent className="relative p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-primary-foreground/80">Current Balance</span>
              </div>
              <Badge variant="secondary" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 backdrop-blur-sm">
                <Banknote className="w-3 h-3 mr-1" />
                BDT
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-bold tracking-tight tabular-nums">
                ৳ <AnimatedCounter value={balance} />
              </div>
              <p className="text-sm text-primary-foreground/60">
                Available balance
              </p>
            </div>

            <Separator className="bg-primary-foreground/10" />

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <div>
                  <p className="text-xs text-primary-foreground/60">Today's Income</p>
                  <p className="text-sm font-semibold tabular-nums">
                    +৳ {stats.todayIncome.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-300" />
                <div>
                  <p className="text-xs text-primary-foreground/60">Today's Expense</p>
                  <p className="text-sm font-semibold tabular-nums">
                    -৳ {stats.todayExpense.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                variant="secondary"
                className="bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground border-primary-foreground/20 backdrop-blur-sm"
                onClick={() => setSendOpen(true)}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Send Money
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground border-primary-foreground/20 backdrop-blur-sm"
                onClick={() => setCashOutOpen(true)}
              >
                <ArrowUpCircle className="w-3.5 h-3.5 mr-1.5" />
                Cash Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Action Grid */}
      <motion.div variants={itemVariants} className="quick-actions-grid">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Send Money",
              icon: Send,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
              onClick: () => setSendOpen(true),
            },
            {
              label: "Cash Out",
              icon: ArrowUpCircle,
              color: "text-red-500",
              bg: "bg-red-500/10",
              onClick: () => setCashOutOpen(true),
            },
            {
              label: "Transactions",
              icon: Repeat,
              color: "text-purple-500",
              bg: "bg-purple-500/10",
              onClick: () => window.location.href = "/user/transactions",
            },
            {
              label: "Profile",
              icon: Users,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
              onClick: () => window.location.href = "/user/profile",
            },
          ].map((action) => (
            <motion.div
              key={action.label}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                onClick={action.onClick}
              >
                <CardContent className="flex flex-col items-center justify-center gap-2 p-4 md:p-5">
                  <div className={`p-2.5 rounded-xl ${action.bg}`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Statistics Section */}
      <motion.div variants={itemVariants} className="stats-section">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Total Sent",
              value: `৳ ${stats.totalSent.toFixed(2)}`,
              icon: ArrowUpRight,
              color: "text-red-500",
              bg: "bg-red-500/10",
            },
            {
              label: "Total Received",
              value: `৳ ${stats.totalReceived.toFixed(2)}`,
              icon: ArrowDownRight,
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
            {
              label: "Transactions",
              value: transactions.length,
              icon: Repeat,
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              label: "Pending",
              value: stats.pendingCount,
              icon: Clock,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
          ].map((stat) => (
            <motion.div key={stat.label} whileHover={{ y: -2 }} className="group">
              <Card className="border-border/50 group-hover:border-primary/20 transition-colors duration-200">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-lg md:text-xl font-bold tabular-nums">
                        {typeof stat.value === "number" ? stat.value : stat.value}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Profile & Security Section */}
      <motion.div variants={itemVariants} className="profile-security-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileCompletionCard user={user} />
          <SecurityStatusCard user={user} />
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants} className="recent-transactions-section">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Transactions
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1"
              onClick={() => window.location.href = "/user/transactions"}
            >
              View All
              <ChevronRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="p-3 rounded-full bg-muted mb-3">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No transactions yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your recent transactions will appear here
                </p>
              </motion.div>
            ) : (
              <div className="space-y-1">
                {recentTransactions.map((tx, index) => {
                  const {
                    IconComponent,
                    bgColor,
                    iconColor,
                    amountSign,
                    amountColor,
                    details,
                    statusColor,
                  } = getTransactionDetails(tx, currentUserId);

                  return (
                    <motion.div
                      key={tx._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
                        <div className={`p-2 rounded-full ${bgColor} flex-shrink-0`}>
                          <IconComponent className={`w-4 h-4 ${iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {tx.type.replace("_", " ")}
                            </span>
                            <Badge variant={statusColor} className="text-[10px] h-4 px-1 capitalize">
                              {tx.status.toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {details}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-semibold tabular-nums ${amountColor}`}>
                            {amountSign}৳ {tx.amount.toFixed(2)}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {format(new Date(tx.createdAt), "MMM dd, h:mm a")}
                          </p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors flex-shrink-0" />
                      </div>
                      {index < recentTransactions.length - 1 && (
                        <Separator className="ml-14" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Send Money Dialog */}
      <QuickSendMoney
        open={sendOpen}
        onOpenChange={setSendOpen}
        recentReceivers={recentReceivers}
      />

      {/* Quick Cash Out Dialog */}
      <QuickCashOut
        open={cashOutOpen}
        onOpenChange={setCashOutOpen}
        recentAgents={recentAgents}
      />
    </motion.div>
  );
}
