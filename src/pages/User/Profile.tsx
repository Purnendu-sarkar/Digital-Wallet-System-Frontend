/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useResetPasswordMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
import { useEffect, useState, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import Password from "@/components/ui/Password";
import {
  User,
  Mail,
  Smartphone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  UserCheck,
  Camera,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Edit,
  Lock,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Invalid Bangladesh phone number")
    .optional()
    .or(z.literal("")),
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

function PasswordStrength({ password }: { password: string }) {
  const checks = useMemo(
    () => [
      { label: "At least 8 characters", pass: password.length >= 8 },
      { label: "Contains uppercase letter", pass: /[A-Z]/.test(password) },
      { label: "Contains a number", pass: /\d/.test(password) },
      { label: "Contains special character", pass: /[!@#$%^&*]/.test(password) },
    ],
    [password]
  );

  const passedCount = checks.filter((c) => c.pass).length;
  const percentage = (passedCount / checks.length) * 100;

  return (
    <div className="space-y-2 mt-2">
      <Progress value={percentage} className="h-1.5" />
      <div className="space-y-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2 text-xs">
            {check.pass ? (
              <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-muted-foreground shrink-0" />
            )}
            <span className={check.pass ? "text-green-500" : "text-muted-foreground"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileCompletionCard({ user }: { user: any }) {
  const fields = [
    { key: "name", label: "Full Name", icon: UserCheck, filled: !!user?.name },
    { key: "email", label: "Email", icon: Mail, filled: !!user?.email },
    { key: "phone", label: "Phone Number", icon: Smartphone, filled: !!user?.phone },
    { key: "address", label: "Address", icon: MapPin, filled: !!user?.address },
    { key: "picture", label: "Profile Picture", icon: Camera, filled: !!user?.picture },
  ];

  const completedCount = fields.filter((f) => f.filled).length;
  const percentage = Math.round((completedCount / fields.length) * 100);

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-primary" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{percentage}%</span>
          <Badge variant={percentage === 100 ? "default" : "secondary"}>
            {completedCount}/{fields.length}
          </Badge>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="space-y-1.5">
          {fields.map((field) => (
            <div key={field.key} className="flex items-center gap-2 text-xs">
              <field.icon className={`w-3 h-3 ${field.filled ? "text-green-500" : "text-muted-foreground"}`} />
              <span className={field.filled ? "text-foreground" : "text-muted-foreground"}>{field.label}</span>
              {field.filled && <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1">Done</Badge>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityStatusCard({ user }: { user: any }) {
  const checks = [
    { label: "Email Verified", passed: user?.isVerified, icon: Mail },
    { label: "Phone Added", passed: !!user?.phone, icon: Smartphone },
    { label: "Account Active", passed: user?.isActive === "ACTIVE", icon: ShieldCheck },
    { label: "Wallet Active", passed: !user?.wallet?.isBlocked, icon: Wallet },
  ];

  const passedCount = checks.filter((c) => c.passed).length;

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${passedCount === checks.length ? "bg-green-500/10" : "bg-amber-500/10"}`}>
            {passedCount === checks.length ? (
              <ShieldCheck className="w-5 h-5 text-green-500" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {passedCount === checks.length ? "All Secure" : "Needs Attention"}
            </p>
            <p className="text-xs text-muted-foreground">
              {passedCount}/{checks.length} checks passed
            </p>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center gap-2 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full ${check.passed ? "bg-green-500" : "bg-amber-500"}`} />
              <check.icon className={`w-3 h-3 ${check.passed ? "text-green-500" : "text-muted-foreground"}`} />
              <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
              <Badge
                variant={check.passed ? "default" : "outline"}
                className={`ml-auto text-[10px] h-4 px-1 ${check.passed ? "" : "text-amber-500 border-amber-500"}`}
              >
                {check.passed ? "Passed" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

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
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
      toast.error(error?.data?.message || "Failed to change password.");
    }
  };

  if (userLoading) {
    return (
      <motion.div
        className="p-4 md:p-6 max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (userError) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-lg font-medium">Failed to load profile</p>
            <p className="text-sm text-muted-foreground">
              There was a problem loading your profile information.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const memberSince = userInfo?.createdAt
    ? new Date(userInfo.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <motion.div
      className="p-4 md:p-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-amber-500/10">
            <User className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your personal information and security
            </p>
          </div>
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Avatar & Identity Card */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-amber-500/20 to-primary/10" />
            <CardContent className="relative -mt-10 pb-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 ring-4 ring-background shadow-md">
                  <AvatarImage src={userInfo?.picture} alt={userInfo?.name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {userInfo?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mt-3">{userInfo?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{userInfo?.email}</span>
                </div>
                <Badge variant="secondary" className="mt-2">
                  {userInfo?.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Info Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="text-xl font-bold tabular-nums">৳ {userInfo?.wallet?.balance.toFixed(2) || "0.00"}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={userInfo?.wallet?.isBlocked ? "destructive" : "default"}>
                  {userInfo?.wallet?.isBlocked ? "Blocked" : "Active"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account</span>
                <Badge variant={userInfo?.isActive === "ACTIVE" ? "default" : "secondary"}>
                  {userInfo?.isActive || "N/A"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{userInfo?.phone || "Not set"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">{userInfo?.address || "Not set"}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium">{memberSince}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div variants={itemVariants} className="space-y-4">
          <ProfileCompletionCard user={userInfo} />
          <SecurityStatusCard user={userInfo} />

          {/* Action Buttons */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Edit Profile Dialog */}
              <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 justify-start">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Update Profile
                    </DialogTitle>
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
                                className="h-10"
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
                                className="h-10"
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              Bangladesh format: 01XXXXXXXXX or +8801XXXXXXXXX
                            </p>
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
                                className="h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={updateLoading}
                        className="w-full h-10 gap-2"
                      >
                        {updateLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4" />
                            Update Profile
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Change Password Dialog */}
              <Dialog
                open={openResetPassword}
                onOpenChange={setOpenResetPassword}
              >
                <DialogTrigger asChild>
                  <Button className="w-full gap-2 justify-start">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Change Password
                    </DialogTitle>
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
                              <div className="relative">
                                <Password
                                  {...field}
                                  placeholder="Enter your old password"
                                  className="h-10 pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowOldPassword(!showOldPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
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
                              <div className="relative">
                                <Password
                                  {...field}
                                  placeholder="Enter your new password"
                                  className="h-10 pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                            {field.value && <PasswordStrength password={field.value} />}
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={resetPasswordLoading}
                        className="w-full h-10 gap-2"
                      >
                        {resetPasswordLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Changing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
