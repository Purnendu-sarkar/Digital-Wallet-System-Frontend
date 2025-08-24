/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useSendMoneyMutation } from "@/redux/features/transaction/transactionApi";

const formSchema = z.object({
  searchTerm: z.string().min(1, { message: "Enter phone or email to search" }),
  receiverId: z.string().min(1, { message: "Select a receiver" }),
  amount: z
    .number()
    .min(1, { message: "Amount must be at least 1" })
    .positive(),
});

export default function SendMoney() {
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

  const users = data?.data ?? [];

  const [sendMoney, { isLoading: isSending }] = useSendMoneyMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: "",
      receiverId: "",
      amount: 0,
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
      setOpen(false);
    } catch (error) {
      toast.error("Failed to send money");
    }
  };

  console.log("users data =>", users);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Send Money</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="receiverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver (Search by Phone or Email)</FormLabel>
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
                          ? users.find((user) => user._id === field.value)?.name
                          : "Search and select receiver"}
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
                    ) : users.length === 0 ? (
                      <p className="p-2 text-center text-muted-foreground">
                        No users found
                      </p>
                    ) : (
                      <div className="max-h-48 overflow-y-auto">
                        {users.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center p-2 cursor-pointer hover:bg-accent"
                            onClick={() => {
                              field.onChange(user._id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                user._id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div>
                              <p>{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}{" "}
                                {user.phone ? `(${user.phone})` : ""}
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
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSending}>
            {isSending ? "Sending..." : "Send Money"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
