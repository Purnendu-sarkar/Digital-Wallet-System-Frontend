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
import { useSendMoneyMutation } from "@/redux/features/transaction/transactionApi";

const formSchema = z.object({
  receiverId: z.string().min(1, { message: "Select a receiver" }),
  amount: z
    .number()
    .min(1, { message: "Amount must be at least 1" })
    .positive()
    .refine((val) => val.toString() === parseFloat(val.toString()).toString(), {
      message: "Invalid amount format",
    }),
});

interface QuickSendMoneyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recentReceivers: any[];
}

export default function QuickSendMoney({
  open,
  onOpenChange,
  recentReceivers,
}: QuickSendMoneyProps) {
  const [selectedReceiverId, setSelectedReceiverId] = React.useState("");
  const [sendMoney, { isLoading: isSending }] = useSendMoneyMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverId: "",
      amount: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await sendMoney({
        receiverId: values.receiverId,
        amount: values.amount,
      }).unwrap();
      toast.success("Money sent successfully");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to send money";
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
          <DialogTitle>Quick Send Money</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm font-medium">Recent Receivers (Last 5)</p>
          {recentReceivers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No recent receivers found.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {recentReceivers.map((receiver) => (
                <div
                  key={receiver._id}
                  className={cn(
                    "flex items-center p-2 cursor-pointer hover:bg-accent rounded-md",
                    receiver._id === selectedReceiverId && "bg-accent"
                  )}
                  onClick={() => {
                    setSelectedReceiverId(receiver._id);
                    form.setValue("receiverId", receiver._id);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      receiver._id === selectedReceiverId
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{receiver.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {receiver.email}{" "}
                      {receiver.phone ? `(${receiver.phone})` : ""}
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
                disabled={isSending || !selectedReceiverId}
              >
                {isSending ? "Sending..." : "Send Money"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
