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
import { Fade, Zoom } from "react-awesome-reveal";

export type FeaturesGridProps = {
  loading?: boolean;
  error?: boolean;
  totalTransactions?: number;
};

export default function FeaturesGrid({
  loading,
  error,
  totalTransactions = 0,
}: FeaturesGridProps) {
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
      description: `Track ${totalTransactions}+ transactions with detailed filters (type, date, status) and analytics.`,
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

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex flex-col gap-4 p-6 border rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {error && <></>}

        <Fade direction="up" cascade damping={0.15} triggerOnce>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold">Features</h2>
            <p className="text-muted-foreground mt-2">
              Explore the powerful features of our secure and user-friendly
              Digital Wallet.
            </p>
          </div>
        </Fade>

        <Zoom cascade damping={0.08} triggerOnce>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, index) => {
              const Icon = f.icon;
              return (
                <div
                  key={`${f.title}-${index}`}
                  className="flex flex-col items-start gap-4 py-8 px-6 rounded-xl border shadow-sm bg-gradient-to-br from-background to-muted/50 hover:shadow-md transition h-full"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="text-muted-foreground">{f.description}</p>
                </div>
              );
            })}
          </div>
        </Zoom>
      </div>
    </section>
  );
}
