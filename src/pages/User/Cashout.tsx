/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import debounce from "lodash/debounce";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSearchUsersQuery } from "@/redux/features/user/userApi";
import { useCashOutMutation } from "@/redux/features/transaction/transactionApi";

// Form schema with refined amount to prevent leading zeros
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

export default function Cashout() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const debouncedSearch = React.useMemo(
    () => debounce((value: string) => setSearchTerm(value), 500),
    []
  );

  const { data, isLoading: isSearching } = useSearchUsersQuery(
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

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await cashOut({
        agentId: values.agentId,
        amount: values.amount,
      }).unwrap();
      toast.success("Cash-out successful");
      form.reset();
      setOpen(false);
      setSearchTerm("");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to process cash-out";
      toast.error(errorMessage);
    }
  };

  // Handle amount input to remove leading zeros
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove leading zeros and parse as number
    const parsedValue = value.replace(/^0+/, "") || "0";
    form.setValue("amount", parseFloat(parsedValue) || 0);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-[0_4px_6px_-1px_var(--border)]">
      <h2 className="text-2xl font-bold mb-6">Cash Out</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent (Search by Phone or Email)</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? agents.find((agent) => agent._id === field.value)
                              ?.name
                          : "Search and select agent"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <div className="p-2">
                      <Input
                        placeholder="Search by phone or email..."
                        onChange={(e) => {
                          form.setValue("searchTerm", e.target.value);
                          debouncedSearch(e.target.value);
                        }}
                      />
                    </div>
                    {isSearching ? (
                      <Skeleton className="h-32 w-full" />
                    ) : agents.length === 0 ? (
                      <p className="p-2 text-center text-muted-foreground">
                        No agents found
                      </p>
                    ) : (
                      <div className="max-h-48 overflow-y-auto">
                        {agents.map((agent) => (
                          <div
                            key={agent._id}
                            className="flex items-center p-2 cursor-pointer hover:bg-accent"
                            onClick={() => {
                              field.onChange(agent._id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                agent._id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div>
                              <p>{agent.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {agent.email}{" "}
                                {agent.phone ? `(${agent.phone})` : ""}
                              </p>
                            </div>
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
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Cash Out"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
