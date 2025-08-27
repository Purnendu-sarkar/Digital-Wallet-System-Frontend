import { Button } from "@/components/ui/button";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllTransactionsQuery } from "@/redux/features/transaction/transactionApi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeaturesGrid from "./FeaturesGrid";


export default function Features() {
  const { data: user, isLoading: isUserLoading } = useUserInfoQuery();
  const {
    data: transactionData,
    isLoading: isTransactionLoading,
    isError,
  } = useGetAllTransactionsQuery({
    page: 1,
    limit: 10,
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getDashboardRoute = () => {
    if (!user?.data?.role) return "/register";
    switch (user.data.role) {
      case "ADMIN":
        return "/admin/overview";
      case "AGENT":
        return "/agent/overview";
      case "USER":
        return "/user/overview";
      default:
        return "/dashboard";
    }
  };

  const isAuthenticated = !!user?.data;
  const loading = isInitialLoading || isTransactionLoading || isUserLoading;
  const totalTx = transactionData?.meta?.totalTransactions ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top  */}
      <section className="py-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isAuthenticated
              ? `Welcome Back, ${user?.data?.name || "User"}!`
              : "Discover Our Wallet Features"}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
            {isAuthenticated
              ? "Access your wallet to send money, track transactions, and manage your finances with ease."
              : "Experience secure, fast, and convenient financial transactions with our Digital Wallet."}
          </p>
          <Button asChild>
            <Link
              to={isAuthenticated ? getDashboardRoute() : "/register"}
              className="text-white bg-blue-700 hover:bg-blue-800"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Middle  */}
      <FeaturesGrid
        loading={loading}
        error={isError}
        totalTransactions={totalTx}
      />

      {/* Bottom */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {isAuthenticated
              ? "Explore Your Wallet"
              : "Ready to Simplify Your Payments?"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
            {isAuthenticated
              ? "Dive into your wallet to send money, track transactions, and manage your finances."
              : "Join thousands of users enjoying fast, secure, and convenient transactions."}
          </p>
          <Button asChild>
            <Link
              to={isAuthenticated ? getDashboardRoute() : "/register"}
              className="text-white bg-blue-700 hover:bg-blue-800"
            >
              {isAuthenticated ? "Manage Your Wallet" : "Sign Up Now"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
