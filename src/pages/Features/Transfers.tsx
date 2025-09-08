import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export default function Transfers() {
  const { data: userData } = useUserInfoQuery();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Send className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transfers</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Send money instantly to other users using a phone number or email.
            The Send Money feature has a 1% fee and you will receive
            notifications for each transaction.
          </p>
          <Button asChild size="lg">
            <Link
              to={
                userData?.data ? `/${userData.data.role}/overview` : "/register"
              }
            >
              {userData?.data ? "Go to Dashboard" : "Get Started"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Seamless Money Transfers
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto text-center">
            Our transfer system allows you to send money quickly and securely.
            Each transaction is protected and can be tracked.
          </p>
        </div>
      </section>
    </div>
  );
}
