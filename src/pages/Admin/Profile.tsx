/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useResetPasswordMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Password from "@/components/ui/Password";

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Invalid Bangladesh phone number")
    .optional(),
  address: z.string().optional(),
});
const resetPasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, "Old password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])/,
      "Old password must contain at least 1 uppercase letter"
    )
    .regex(
      /^(?=.*[!@#$%^&*])/,
      "Old password must contain at least 1 special character"
    )
    .regex(/^(?=.*\d)/, "Old password must contain at least 1 number"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])/,
      "New password must contain at least 1 uppercase letter"
    )
    .regex(
      /^(?=.*[!@#$%^&*])/,
      "New password must contain at least 1 special character"
    )
    .regex(/^(?=.*\d)/, "New password must contain at least 1 number"),
});

interface UpdateFormData {
  name?: string;
  phone?: string;
  address?: string;
}

interface ResetPasswordFormData {
  oldPassword: string;
  newPassword: string;
}

export default function Profile() {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useUserInfoQuery();
  const userInfo = userData?.data;
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [resetPassword, { isLoading: resetPasswordLoading }] =
    useResetPasswordMutation();

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const updateForm = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (userInfo) {
      updateForm.reset({
        name: userInfo.name || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
      });
    }
  }, [userInfo, updateForm]);

  const onUpdateSubmit = async (values: UpdateFormData) => {
    const payload: Partial<UpdateFormData> = {};
    if (values.name?.trim()) payload.name = values.name.trim();
    if (values.phone?.trim()) payload.phone = values.phone.trim();
    if (values.address?.trim()) payload.address = values.address.trim();

    if (Object.keys(payload).length === 0) {
      toast.error("No changes to update");
      return;
    }

    try {
      await updateUser({ userId: userInfo?._id, payload }).unwrap();
      toast.success("Profile updated successfully!");
      setOpenUpdate(false);
    } catch (error: any) {
      console.error("Update error:", error);
      // console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update profile.");
    }
  };

  const onResetPasswordSubmit = async (values: ResetPasswordFormData) => {
    try {
      await resetPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      setOpenResetPassword(false);
      resetPasswordForm.reset();
    } catch (error: any) {
      console.error("Reset password error:", error);
      // console.error("Reset password error:", error);
      toast.error(error?.data?.message || "Failed to change password.");
    }
  };

  if (userLoading) return <Skeleton className="h-64 w-full" />;
  if (userError) return <p>Error loading profile.</p>;

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center space-y-3">
          <Avatar className="w-20 h-20">
            <AvatarImage src={userInfo?.picture} alt={userInfo?.name} />
            <AvatarFallback>
              {userInfo?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-semibold">
            {userInfo?.name}
          </CardTitle>
          <p className="text-muted-foreground">{userInfo?.email}</p>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Phone:</span>
            <span>{userInfo?.phone || "Not set"}</span>

            <span className="font-medium">Address:</span>
            <span>{userInfo?.address || "Not set"}</span>

            <span className="font-medium">Role:</span>
            <span>{userInfo?.role}</span>

            <span className="font-medium">Wallet Balance:</span>
            <span>৳{userInfo?.wallet.balance}</span>

            <span className="font-medium">Status:</span>
            <span>{userInfo?.isActive ? "Active" : "Inactive"}</span>
          </div>

          <div className="flex justify-between pt-4">
            {/* Edit Profile Button */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <Form {...updateForm}>
                  <form
                    onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={updateForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your name"
                              className="rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="01XXXXXXXXX"
                              className="rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your address"
                              className="rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={updateLoading}
                      className="w-full rounded-xl"
                    >
                      {updateLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Change Password Button */}
            <Dialog
              open={openResetPassword}
              onOpenChange={setOpenResetPassword}
            >
              <DialogTrigger asChild>
                <Button variant="default" className="rounded-xl">
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <Form {...resetPasswordForm}>
                  <form
                    onSubmit={resetPasswordForm.handleSubmit(
                      onResetPasswordSubmit
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={resetPasswordForm.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Old Password</FormLabel>
                          <FormControl>
                            <Password
                              {...field}
                              placeholder="Enter your old password"
                              className="rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetPasswordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Password
                              {...field}
                              placeholder="Enter your new password"
                              className="rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={resetPasswordLoading}
                      className="w-full rounded-xl"
                    >
                      {resetPasswordLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
