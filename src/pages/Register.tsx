import DigitalRegister from "@/assets/Image/LogIN.png";
import { Link } from "react-router-dom";
import { RegisterForm } from "@/components/modules/Authentication/RegisterForm";
import Logo from "@/assets/icons/digital-wallet.png";

export default function Register() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={DigitalRegister}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
