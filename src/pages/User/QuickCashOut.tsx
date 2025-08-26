/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useCashOutMutation } from "@/redux/features/transaction/transactionApi";

const formSchema = z.object({
  agentId: z.string().min(1, { message: "Select an agent" }),
  amount: z
    .number()
    .min(1, { message: "Amount must be at least 1" })
    .positive()
    .refine((val) => val.toString() === parseFloat(val.toString()).toString(), {
      message: "Invalid amount format",
    }),
});

interface QuickCashOutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recentAgents: any[];
}

export default function QuickCashOut({
  open,
  onOpenChange,
  recentAgents,
}: QuickCashOutProps) {
  const [selectedAgentId, setSelectedAgentId] = React.useState("");
  const [cashOut, { isLoading: isProcessing }] = useCashOutMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentId: "",
      amount: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await cashOut({
        agentId: values.agentId,
        amount: values.amount,
      }).unwrap();
      toast.success("Cash-out successful");
      form.reset();
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Cash Out</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm font-medium">Recent Agents (Last 5)</p>
          {recentAgents.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No recent agents found.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {recentAgents.map((agent) => (
                <div
                  key={agent._id}
                  className={cn(
                    "flex items-center p-2 cursor-pointer hover:bg-accent rounded-md",
                    agent._id === selectedAgentId && "bg-accent"
                  )}
                  onClick={() => {
                    setSelectedAgentId(agent._id);
                    form.setValue("agentId", agent._id);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      agent._id === selectedAgentId
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.email} {agent.phone ? `(${agent.phone})` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (BDT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={field.value || ""}
                        onChange={handleAmountChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing || !selectedAgentId}
              >
                {isProcessing ? "Processing..." : "Cash Out"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
