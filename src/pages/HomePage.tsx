import { HeroSection } from "@/components/modules/homePage/HeroSection";
import { useEffect, useState } from "react";
import FeaturesGrid from "./FeaturesGrid";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllTransactionsQuery } from "@/redux/features/transaction/transactionApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import cashBack from "@/assets/images/offers/10-cashback.webp";
import FreeTransfers from "@/assets/images/offers/FreeTransfers.jpg";
import { Star, Send, DollarSign, History, Wallet, ArrowRight, TrendingUp, Users, HeadphonesIcon, CheckCircle } from "lucide-react";
import Ayesha from "@/assets/images/team/ayesha.jpg";
import Tanvir from "@/assets/images/team/tanvir.jpg";
import Sadia from "@/assets/images/team/sadia.jpg";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { mockBlogPosts } from "@/data/mockBlogPosts";

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

const services = [
  {
    title: "Send Money",
    description: "Transfer money instantly to other users with low fees.",
    icon: Send,
  },
  {
    title: "Cash-In",
    description: "Add funds to your wallet through our trusted agents.",
    icon: DollarSign,
  },
  {
    title: "Cash-Out",
    description: "Withdraw cash easily via our agent network.",
    icon: Wallet,
  },
  {
    title: "Transaction History",
    description:
      "Track all your transactions with detailed history and filters.",
    icon: History,
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

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
      navigate("/login");
    } else {
      toast.success(`You have successfully claimed the ${offerTitle} offer.`, {
        description: "Offer claimed successfully!",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <FeaturesGrid
        loading={loading}
        error={isError}
        totalTransactions={totalTx}
      />

      <section className="w-full py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Special Offers</h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              Exclusive deals to help you save more
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {offers.map((offer, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-2xl border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="aspect-[2/1] overflow-hidden">
                  <img
                    src={offer.img}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{offer.title}</h3>
                  <p className="text-muted-foreground mt-2">{offer.description}</p>
                  <Button
                    className="mt-4 rounded-full"
                    onClick={() => handleClaimOffer(offer.title)}
                  >
                    Claim Offer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Our Services</h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              Everything you need to manage your money
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border bg-card hover:bg-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mb-5">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              Real feedback from real people
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="rounded-2xl border bg-card p-6 sm:p-8 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">&ldquo;{testimonial.review}&rdquo;</p>
                <p className="mt-4 font-semibold text-foreground">{testimonial.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Latest Blog Posts</h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              Insights and tips from our team
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mockBlogPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={staggerItem}
                className="group rounded-2xl border bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold leading-snug">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      {post.author} &middot; {post.date}
                    </p>
                    <Button asChild variant="ghost" size="sm" className="rounded-full">
                      <Link to="/blog">Read</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="flex justify-center mt-10"
          >
            <Button asChild size="lg" className="rounded-full">
              <Link to="/blog">
                View All Blogs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Our Achievements</h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              Milestones that define our journey
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: TrendingUp, value: "500+", label: "Total Transactions" },
              { icon: Users, value: "1M+", label: "Happy Users" },
              { icon: HeadphonesIcon, value: "24/7", label: "Customer Support" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="group rounded-2xl border bg-card p-8 text-center hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <stat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">{stat.value}</h3>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Meet Our Team</h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              The people behind Digital Wallet
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={staggerItem}
                className="group rounded-2xl border bg-card p-6 sm:p-8 text-center hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="relative mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              Stay updated with the latest offers and updates!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1 h-12 rounded-xl"
              />
              <Button className="h-12 rounded-xl px-6">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="mx-auto max-w-3xl text-center rounded-3xl border bg-card p-8 sm:p-12 lg:p-16 shadow-xl"
          >
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Get Started Today!</h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg max-w-xl mx-auto">
              Join millions of users and experience seamless digital payments.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full px-10 text-base shadow-lg shadow-primary/25">
              <Link
                to={
                  userData?.data ? `/${userData.data.role}/overview` : "/register"
                }
              >
                {userData?.data ? "Go to Dashboard" : "Register Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
