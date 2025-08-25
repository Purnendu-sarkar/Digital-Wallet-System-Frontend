import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, DollarSign, Shield, Smartphone, Clock, BarChart } from "lucide-react";
import { useGetAllTransactionsQuery } from "@/redux/features/transaction/transactionApi";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Link } from "react-router-dom";


const fallbackFeatures = [
  {
    icon: <Send className="w-10 h-10 text-blue-500" />,
    title: "Send Money Instantly",
    description: "Transfer funds to any user using their phone number or email, with zero fees for peer-to-peer transactions."
  },
  {
    icon: <DollarSign className="w-10 h-10 text-blue-500" />,
    title: "Cash-In & Cash-Out",
    description: "Deposit money via agents or withdraw funds with a low 1% transaction fee, as per system rules."
  },
  {
    icon: <Shield className="w-10 h-10 text-blue-500" />,
    title: "Bank-Grade Security",
    description: "Your transactions are secured with JWT-based authentication and bcrypt-encrypted passwords."
  },
  {
    icon: <Smartphone className="w-10 h-10 text-blue-500" />,
    title: "Mobile-First Experience",
    description: "Manage your wallet seamlessly on any device with our responsive, user-friendly interface."
  },
  {
    icon: <Clock className="w-10 h-10 text-blue-500" />,
    title: "24/7 Support",
    description: "Contact our support team anytime via email (support@digitalwallet.com) or phone for assistance."
  },
  {
    icon: <BarChart className="w-10 h-10 text-blue-500" />,
    title: "Track Your Transactions",
    description: "View detailed transaction history with filters for type, date, and status, plus analytics."
  }
];

export default function Features() {
  const { data: user, isLoading: isUserLoading } = useUserInfoQuery(null);

  const { data: transactionData, isLoading: isTransactionLoading, isError } = useGetAllTransactionsQuery({
    page: 1,
    limit: 10
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  const features = fallbackFeatures.map((feature, index) => {
    if (transactionData?.meta && index === 5) {
      return {
        ...feature,
        description: `Monitor ${transactionData.meta.totalTransactions || 0} transactions with advanced filtering and analytics.`
      };
    }
    return feature;
  });

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isAuthenticated ? `Welcome Back, ${user.data.name || "User"}!` : "Discover Our Wallet Features"}
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

      {/* Features Section (Same for all users) */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {(isInitialLoading || isTransactionLoading || isUserLoading) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-48 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-red-500">
              Failed to load data. Showing default features.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mb-2">{feature.icon}</div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {isAuthenticated ? "Explore Your Wallet" : "Ready to Simplify Your Payments?"}
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