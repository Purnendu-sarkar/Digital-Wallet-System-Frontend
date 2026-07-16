import {
  Send,
  DollarSign,
  Shield,
  Smartphone,
  Clock,
  BarChart,
  Banknote,
  FileText,
  Users,
  Bell,
  Settings,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";

export type FeaturesGridProps = {
  loading?: boolean;
  error?: boolean;
  totalTransactions?: number;
};

const features = [
  {
    icon: Shield,
    title: "Secure Wallet",
    description:
      "Your funds are safe with advanced encryption, JWT auth, and multi-layer security.",
  },
  {
    icon: Send,
    title: "Send Money Instantly",
    description:
      "Transfer funds to any user using phone number or email with lightning speed.",
  },
  {
    icon: Banknote,
    title: "Cash-In & Cash-Out",
    description:
      "Deposit money via agents or withdraw funds with low fees, as per system rules.",
  },
  {
    icon: FileText,
    title: "Transaction History",
    description:
      "Track transactions with detailed filters (type, date, status) and analytics.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description:
      "Tailored dashboards for Admins, Agents, and Users with the right permissions.",
  },
  {
    icon: Bell,
    title: "Notifications & Alerts",
    description:
      "Get instant notifications for payments, requests, and system updates.",
  },
  {
    icon: Settings,
    title: "Settings & Customization",
    description:
      "Manage profile, security, and notification preferences in one place.",
  },
  {
    icon: Compass,
    title: "Guided Tour",
    description:
      "Interactive walkthrough to help new users learn features step by step.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Responsive, mobile-first design for a smooth experience on any device.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Contact support anytime via email or phone for quick assistance.",
  },
  {
    icon: DollarSign,
    title: "Low Fees",
    description:
      "Transparent pricing with zero P2P fees and fair agent cash-out rates.",
  },
  {
    icon: BarChart,
    title: "Analytics",
    description:
      "Visualize spending trends and insights to stay on top of finances.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function FeaturesGrid({
  loading,
}: FeaturesGridProps) {
  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex flex-col gap-4 p-6 border rounded-xl bg-muted/30"
              >
                <div className="h-12 w-12 rounded-full bg-muted-foreground/20" />
                <div className="h-5 w-3/4 rounded bg-muted-foreground/20" />
                <div className="h-4 w-full rounded bg-muted-foreground/20" />
                <div className="h-4 w-2/3 rounded bg-muted-foreground/20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Everything you need in a digital wallet
          </h2>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg max-w-2xl mx-auto">
            Explore the powerful features of our secure and user-friendly
            Digital Wallet platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, index) => {
            const Icon = f.icon;
            return (
            <motion.div
              key={`${f.title}-${index}`}
              variants={cardVariants}
              className="group relative flex flex-col items-start gap-4 p-6 sm:p-8 rounded-2xl border bg-card hover:bg-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
