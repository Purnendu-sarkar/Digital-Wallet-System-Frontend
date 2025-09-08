import { HeroSection } from "@/components/modules/homePage/HeroSection";
import { useEffect, useState } from "react";
import FeaturesGrid from "./FeaturesGrid";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllTransactionsQuery } from "@/redux/features/transaction/transactionApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import cashBack from "@/assets/images/offers/10-cashback.webp";
import FreeTransfers from "@/assets/images/offers/FreeTransfers.jpg";
import { Star } from "lucide-react";
import Ayesha from "@/assets/images/team/ayesha.jpg";
import Tanvir from "@/assets/images/team/tanvir.jpg";
import Sadia from "@/assets/images/team/sadia.jpg";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Team data
const teamMembers = [
  {
    name: "Ayesha Rahman",
    role: "Founder & CEO",
    bio: "With over 15 years in fintech, Ayesha leads our mission to make financial services accessible to all.",
    image: Ayesha,
  },
  {
    name: "Tanvir Ahmed",
    role: "Chief Technology Officer",
    bio: "Tanvir drives innovation in our platform, ensuring secure and seamless transactions.",
    image: Tanvir,
  },
  {
    name: "Sadia Khan",
    role: "Head of Operations",
    bio: "Sadia oversees daily operations, ensuring our users and agents have the best experience.",
    image: Sadia,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery();
  console.log("User Data:", userData?.data);
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

  const testimonials = [
    {
      name: "Pranav Kumar",
      review: "This wallet app made my life so much easier!",
      rating: 5,
    },
    { name: "Ravi Shukla", review: "Fast and secure transactions!", rating: 4 },
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

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{testimonial.review}</p>
                <p className="mt-4 font-semibold">{testimonial.name}</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <h2 className="text-3xl font-bold mb-8">Our Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold">500+</h3>
              <p className="text-muted-foreground">Total Transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold">1M+</h3>
              <p className="text-muted-foreground">Happy Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold">24/7</h3>
              <p className="text-muted-foreground">Customer Support</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Meet Our Team
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-24 w-24 rounded-full mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                    <p className="text-center mt-2 text-sm">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

       {/* Newsletter Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card text-card-foreground py-12 text-center rounded-lg">
          <h2 className="text-3xl font-bold px-8 mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6 text-muted-foreground">Stay updated with the latest offers and updates!</p>
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-input text-foreground" />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card text-card-foreground text-center rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Get Started Today!</h2>
          <p className="mb-6">
            Join millions of users and experience seamless digital payments.
          </p>
          <Button asChild size="lg">
            <Link
              to={
                userData?.data ? `/${userData.data.role}/overview` : "/register"
              }
            >
              {userData?.data ? "Go to Dashboard" : "Register Now"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
