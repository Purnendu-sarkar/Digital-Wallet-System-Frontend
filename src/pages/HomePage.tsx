import { HeroSection } from "@/components/modules/homePage/HeroSection";
import { useEffect, useState } from "react";
import FeaturesGrid from "./FeaturesGrid";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllTransactionsQuery } from "@/redux/features/transaction/transactionApi";

export default function HomePage() {
  const { isLoading: isUserLoading } = useUserInfoQuery();
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

  const loading = isInitialLoading || isTransactionLoading || isUserLoading;
  const totalTx = transactionData?.meta?.totalTransactions ?? 0;
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <HeroSection />
      <FeaturesGrid
        loading={loading}
        error={isError}
        totalTransactions={totalTx}
      />
    </div>
  );
}
