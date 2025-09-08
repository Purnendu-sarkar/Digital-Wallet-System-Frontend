import { HeroSection } from "@/components/modules/homePage/HeroSection";
import { useEffect, useState } from "react";
import FeaturesGrid from "./FeaturesGrid";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllTransactionsQuery } from "@/redux/features/transaction/transactionApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import cashBack from "@/assets/images/offers/10-cashback.webp";
import FreeTransfers from "@/assets/images/offers/FreeTransfers.jpg";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery();
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

  const offers = [
    {
      title: "10% Cashback",
      description: "Get 10% cashback on your first transaction",
      img: cashBack,
    },
    {
      title: "Free Transfers",
      description: "No fees on transfers this month",
      img: FreeTransfers,
    },
  ];

  const handleClaimOffer = (offerTitle: string) => {
    if (!userData?.data?.email) {
      toast.error("Please login to claim this offer.", {
        description: "You need to be logged in to access this offer.",
      });
      console.log("User not logged in, redirecting to login page.", userData);
      navigate("/login");
    } else {
      toast.success(`You have successfully claimed the ${offerTitle} offer.`, {
        description: "Offer claimed successfully!",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <HeroSection />
      <FeaturesGrid
        loading={loading}
        error={isError}
        totalTransactions={totalTx}
      />

      {/* Offer Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Special Offers</h2>
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer, index) => (
              <Card key={index}>
                <CardHeader>
                  <img
                    src={offer.img}
                    alt={offer.title}
                    className="h-48 w-full object-cover rounded-xl"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle>{offer.title}</CardTitle>
                  <p className="text-muted-foreground">{offer.description}</p>
                  <Button
                    className="mt-4"
                    onClick={() => handleClaimOffer(offer.title)}
                  >
                    Claim Offer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No offers available at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
