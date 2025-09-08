import DigitalLogin from "@/assets/images/LogIN.png";
import { Link } from "react-router-dom";
import { LoginForm } from "@/components/modules/Authentication/LoginForm";
import Logo from "@/assets/icons/digital-wallet.png";

export default function Login() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      <div className="flex flex-col gap-6 p-6 md:p-12 lg:p-16">
        <div className="flex justify-center gap-3 md:justify-start">
          <Link to="/" className="flex items-center gap-3 font-semibold text-foreground">
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
            <span className="text-lg">Digital Wallet</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md bg-card shadow-xl rounded-lg p-8">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={DigitalLogin}
          alt="Login Illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
      </div>
    </div>
  );
}
