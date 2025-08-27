/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {
  useGetAllTransactionsQuery,
  type ITransaction,
} from "@/redux/features/transaction/transactionApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDown,
  ArrowUp,
  Send,
  ArrowUpCircle,
  ArrowDownCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
const QuickSendMoney = lazy(() => import("./QuickSendMoney"));
const QuickCashOut = lazy(() => import("./QuickCashOut"));

import * as React from "react";


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
    limit: 100,
    page: 1,
  });

  const balance = userData?.data?.wallet?.balance || 0;
  let transactions = transactionsData?.data || [];
  const currentUserId = userData?.data?._id;

  transactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Recent Send Money Receivers
  const recentReceivers = Array.from(
    transactions
      .filter(
        (tx) => tx.type === "SEND_MONEY" && tx.sender?._id === currentUserId
      )
      .reduce((map, tx) => {
        if (tx.receiver && !map.has(tx.receiver._id))
          map.set(tx.receiver._id, tx.receiver);
        return map;
      }, new Map<string, any>())
      .values()
  ).slice(0, 5);

  // Recent Cash Out Agents
  const recentAgents = Array.from(
    transactions
      .filter(
        (tx) => tx.type === "CASH_OUT" && tx.sender?._id === currentUserId
      )
      .reduce((map, tx) => {
        if (tx.agent && !map.has(tx.agent._id)) map.set(tx.agent._id, tx.agent);
        return map;
      }, new Map<string, any>())
      .values()
  ).slice(0, 5);

  const [sendOpen, setSendOpen] = React.useState(false);
  const [cashOutOpen, setCashOutOpen] = React.useState(false);

  if (userLoading || txLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Error state
  if (userError || txError) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTitle>This is an error!</AlertTitle>
        <AlertDescription>
          There was a problem loading the data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const getTransactionDetails = (tx: ITransaction) => {
    let IconComponent: LucideIcon;
    let iconColor = "text-gray-500";
    let amountSign = "";
    let amountColor = "text-black";
    let details = "";

    const isSender = tx.sender?._id === currentUserId;
    const isReceiver = tx.receiver?._id === currentUserId;
    const isAgent = tx.agent?._id === currentUserId;

    switch (tx.type) {
      case "TOP_UP":
        IconComponent = ArrowDownCircle;
        iconColor = "text-green-500";
        amountSign = "+";
        amountColor = "text-green-600";
        details = "Top-up to wallet";
        break;
      case "WITHDRAW":
        IconComponent = ArrowUpCircle;
        iconColor = "text-red-500";
        amountSign = "-";
        amountColor = "text-red-600";
        details = "Withdrawal from wallet";
        break;
      case "SEND_MONEY":
        if (isSender) {
          IconComponent = ArrowUp;
          iconColor = "text-red-500";
          amountSign = "-";
          amountColor = "text-red-600";
          details = `Sent to ${
            tx.receiver?.name || tx.receiver?.email || "N/A"
          }`;
        } else if (isReceiver) {
          IconComponent = ArrowDown;
          iconColor = "text-green-500";
          amountSign = "+";
          amountColor = "text-green-600";
          details = `Received from ${
            tx.sender?.name || tx.sender?.email || "N/A"
          }`;
        } else {
          IconComponent = Send;
          details = "Unknown SEND_MONEY transaction";
        }
        break;
      case "CASH_IN":
        if (isAgent) {
          IconComponent = ArrowUp;
          iconColor = "text-green-500";
          amountSign = "+";
          amountColor = "text-green-600";
          details = `Cash In for ${
            tx.sender?.name || tx.sender?.email || "N/A"
          }`;
        } else {
          IconComponent = ArrowDown;
          iconColor = "text-green-500";
          amountSign = "+";
          amountColor = "text-green-600";
          details = `Via Agent ${tx.agent?.name || tx.agent?.email || "N/A"}`;
        }
        break;
      case "CASH_OUT":
        if (isAgent) {
          IconComponent = ArrowDown;
          iconColor = "text-red-500";
          amountSign = "-";
          amountColor = "text-red-600";
          details = `Cash Out for ${
            tx.sender?.name || tx.sender?.email || "N/A"
          }`;
        } else {
          IconComponent = ArrowUp;
          iconColor = "text-red-500";
          amountSign = "-";
          amountColor = "text-red-600";
          details = `Via Agent ${tx.agent?.name || tx.agent?.email || "N/A"}`;
        }
        break;
      default:
        IconComponent = Send;
        details = "Unknown transaction";
    }

    return { IconComponent, iconColor, amountSign, amountColor, details };
  };

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-2 gap-4">
        {/* Wallet Balance Card */}
        <Card className="w-full max-w-md mx-auto shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ৳ {balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="w-full max-w-md mx-auto shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <Button onClick={() => setSendOpen(true)}>Quick Send Money</Button>
            <Button onClick={() => setCashOutOpen(true)}>Quick Cash Out</Button>
          </CardContent>
        </Card>

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
      </div>

      {/* Recent Transactions Card */}
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions found.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, index) => {
                const {
                  IconComponent,
                  iconColor,
                  amountSign,
                  amountColor,
                  details,
                } = getTransactionDetails(tx);
                return (
                  <div key={tx._id}>
                    <div className="flex items-center justify-between py-4">
                      {/* Left: Icon */}
                      <div className="flex-shrink-0 me-4">
                        <IconComponent className={iconColor} />
                      </div>
                      {/* Middle: Type and Details */}
                      <div className="flex-grow">
                        <p className="font-medium">
                          {tx.type.replace("_", " ")}
                        </p>
                        <p className="text-sm text-gray-500">{details}</p>
                      </div>
                      {/* Right: Amount and Date */}
                      <div className="text-end flex-shrink-0">
                        <p className={`font-medium ${amountColor}`}>
                          {amountSign}৳ {tx.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(tx.createdAt), "dd MMM, h:mm a")}
                        </p>
                      </div>
                    </div>
                    {index < transactions.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
