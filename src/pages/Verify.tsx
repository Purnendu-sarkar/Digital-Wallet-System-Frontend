import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state);

  useEffect(() => {
    if (!email) {
      toast.error("No email provided");
      navigate("/");
    }
  }, [email, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl">Verify your email: {email}. Check your inbox for verification link.</h1> // Add verification logic if backend supports
    </div>
  );
}