/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  ArrowUpCircle,
  ArrowRight,
  Wallet,
  AlertCircle,
  RefreshCw,
  Banknote,
  Search,
  Store,
} from "lucide-react";
import { useSearchUsersQuery } from "@/redux/features/user/userApi";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useCashOutMutation } from "@/redux/features/transaction/transactionApi";
import { useNavigate } from "react-router";

const formSchema = z.object({
  searchTerm: z.string().min(1, { message: "Enter phone or email to search" }),
  agentId: z.string().min(1, { message: "Select an agent" }),
  amount: z
    .number()
    .min(1, { message: "Amount must be at least 1" })
    .positive()
    .refine((val) => val.toString() === parseFloat(val.toString()).toString(), {
      message: "Invalid amount format",
    }),
});

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
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

export default function Cashout() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const { data: userData } = useUserInfoQuery();
  const userBalance = userData?.data?.wallet?.balance || 0;

  const debouncedSearch = React.useMemo(
    () => debounce((value: string) => setSearchTerm(value), 500),
    []
  );

  const { data, isLoading: isSearching, isError: searchError } = useSearchUsersQuery(
    { searchTerm },
    { skip: !searchTerm }
  );

  const agents = data?.data ?? [];
  const [cashOut, { isLoading: isProcessing }] = useCashOutMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: "",
      agentId: "",
      amount: undefined,
    },
  });

  const selectedAgentId = form.watch("agentId");
  const selectedAmount = form.watch("amount");
  const selectedAgent = agents.find((a) => a._id === selectedAgentId);

  const estimatedFee = selectedAmount && selectedAmount > 0 ? Math.max(selectedAmount * 0.015, 10) : 0;
  const totalDeduction = selectedAmount ? selectedAmount + estimatedFee : 0;
  const sufficientBalance = userBalance >= totalDeduction;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await cashOut({
        agentId: values.agentId,
        amount: values.amount,
      }).unwrap();
      toast.success("Cash-out successful", {
        description: `৳ ${values.amount.toFixed(2)} withdrawn via ${selectedAgent?.name || "agent"}`,
      });
      navigate("/user/transactions");
      form.reset();
      setOpen(false);
      setSearchTerm("");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to process cash-out";
      toast.error(errorMessage);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = value.replace(/^0+/, "") || "0";
    form.setValue("amount", parseFloat(parsedValue) || 0);
  };

  return (
    <motion.div
      className="p-4 md:p-6 max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-amber-500/10">
            <ArrowUpCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Cash Out</h1>
            <p className="text-sm text-muted-foreground">
              Withdraw cash from your wallet via an agent
            </p>
          </div>
        </div>
      </motion.div>

      {/* Balance Indicator */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card className="border-border/50 bg-gradient-to-r from-amber-500/5 to-transparent">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-500/10">
                <Wallet className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available Balance</p>
                <p className="text-lg font-bold tabular-nums">৳ {userBalance.toFixed(2)}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Banknote className="w-3 h-3 mr-1" />
              BDT
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Form Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-500" />
              Cash Out Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Agent Selection */}
                <FormField
                  control={form.control}
                  name="agentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between h-11",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value && selectedAgent ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-[10px]">
                                      {selectedAgent.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{selectedAgent.name}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Search className="w-4 h-4 text-muted-foreground" />
                                  <span>Search by phone or email...</span>
                                </div>
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <div className="p-2">
                            <Input
                              placeholder="Search agents by phone or email..."
                              onChange={(e) => {
                                form.setValue("searchTerm", e.target.value);
                                debouncedSearch(e.target.value);
                              }}
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                          <Separator />
                          {isSearching ? (
                            <div className="p-3 space-y-2">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Skeleton className="w-8 h-8 rounded-full" />
                                  <div className="space-y-1 flex-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-2 w-32" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : searchError ? (
                            <div className="p-4 text-center">
                              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                              <p className="text-sm text-destructive">Search failed</p>
                              <p className="text-xs text-muted-foreground">Please try again</p>
                            </div>
                          ) : agents.length === 0 && searchTerm ? (
                            <div className="p-4 text-center">
                              <Store className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm font-medium">No agents found</p>
                              <p className="text-xs text-muted-foreground">
                                Try a different search term
                              </p>
                            </div>
                          ) : agents.length === 0 ? (
                            <div className="p-4 text-center">
                              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Type to search for agents
                              </p>
                            </div>
                          ) : (
                            <div className="max-h-56 overflow-y-auto p-1">
                              {agents.map((agent) => (
                                <div
                                  key={agent._id}
                                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                                  onClick={() => {
                                    field.onChange(agent._id);
                                    setOpen(false);
                                  }}
                                >
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs">
                                      {agent.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-medium truncate">{agent.name}</p>
                                      <Badge variant="outline" className="text-[10px] h-4 px-1">Agent</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {agent.email}{agent.phone ? ` · ${agent.phone}` : ""}
                                    </p>
                                  </div>
                                  <Check
                                    className={cn(
                                      "w-4 h-4 shrink-0",
                                      agent._id === field.value
                                        ? "text-primary opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount Input */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (BDT)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                            ৳
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-8 h-11 text-lg font-semibold tabular-nums"
                            value={field.value || ""}
                            onChange={handleAmountChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Transaction Summary */}
                {selectedAmount && selectedAmount > 0 && selectedAgentId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-muted/50 rounded-xl p-4 space-y-2"
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Transaction Summary
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cash Out Amount</span>
                        <span className="font-medium tabular-nums">৳ {selectedAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Fee (1.5%)</span>
                        <span className="font-medium tabular-nums">৳ {estimatedFee.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Total Deduction</span>
                        <span className={cn(
                          "font-bold tabular-nums",
                          sufficientBalance ? "text-foreground" : "text-destructive"
                        )}>
                          ৳ {totalDeduction.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {!sufficientBalance && (
                      <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-destructive/10 text-destructive text-xs">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Insufficient balance. You need ৳ {(totalDeduction - userBalance).toFixed(2)} more.</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 text-base gap-2"
                  disabled={isProcessing || !sufficientBalance}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpCircle className="w-4 h-4" />
                      Cash Out
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
