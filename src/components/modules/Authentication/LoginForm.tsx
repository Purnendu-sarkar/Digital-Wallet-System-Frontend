/* eslint-disable @typescript-eslint/no-explicit-any */
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
import config from "@/config";
import Password from "@/components/ui/Password";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Demo credentials from .env
const demoCredentials = {
  ADMIN: {
    email: import.meta.env.VITE_ADMIN_EMAIL,
    password: import.meta.env.VITE_ADMIN_PASSWORD,
  },
  AGENT: {
    email: import.meta.env.VITE_AGENT_EMAIL,
    password: import.meta.env.VITE_AGENT_PASSWORD,
  },
  USER: {
    email: import.meta.env.VITE_USER_EMAIL,
    password: import.meta.env.VITE_USER_PASSWORD,
  },
};

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const form = useForm();
  const [login, { isLoading }] = useLoginMutation();

  // Function to handle demo credential auto-fill
  const handleDemoLogin = (role: "ADMIN" | "AGENT" | "USER") => {
    form.setValue("email", demoCredentials[role].email);
    form.setValue("password", demoCredentials[role].password);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (res.success) {
        toast.success("Logged in successfully");
        // console.log("Login response:", res);

        // Role-based redirection
        if (res.data.user.role === "USER") {
          navigate("/user/overview");
        } else if (res.data.user.role === "AGENT") {
          navigate("/agent/overview");
        } else if (res.data.user.role === "ADMIN") {
          navigate("/admin/overview");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      // console.error("Login error:", err);
      // console.log("Login error response:", err?.data);

      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        JSON.stringify(err?.data) ||
        "Login failed";

      if (errorMessage === "Password does not match") {
        toast.error("Invalid credentials");
      }

      if (errorMessage === "User is not verified") {
        toast.error("Your account is not verified");
        navigate("/verify", { state: { email: data?.email } });
      } else {
        toast.error(errorMessage || "Login failed");
      }
    }
  };
  // console.log(config.baseUrl);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Login to Your Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials or use demo accounts to login
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      className="border-input focus:ring-2 focus:ring-primary"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Password
                      className="border-input focus:ring-2 focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer border-input hover:bg-muted"
          onClick={() => window.open(`${config.baseUrl}/auth/google`, "_self")}
        >
          Login with Google
        </Button>

        {/* Demo Credential Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full border-input hover:bg-muted"
            onClick={() => handleDemoLogin("ADMIN")}
          >
            Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-input hover:bg-muted"
            onClick={() => handleDemoLogin("AGENT")}
          >
            Agent
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-input hover:bg-muted"
            onClick={() => handleDemoLogin("USER")}
          >
            User
          </Button>
        </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="underline underline-offset-4 text-primary hover:text-primary/80"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
