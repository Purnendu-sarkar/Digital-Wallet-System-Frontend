import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone } from "lucide-react";

const faqs = [
  {
    question: "What is the Digital Wallet service?",
    answer:
      "Our Digital Wallet is a secure and convenient way to manage your finances. You can send money, pay bills, deposit funds, and track transactions—all from your phone or computer.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Sign up by visiting the registration page, selecting your role (User or Agent), and providing your details. After verification, you can log in and start using your wallet.",
  },
  {
    question: "Is my money safe in the wallet?",
    answer:
      "Yes, we use advanced encryption and JWT-based authentication to ensure your funds and personal information are secure. Regular security audits are conducted to maintain safety.",
  },
  {
    question: "What are the transaction fees?",
    answer:
      "Fees vary based on transaction type. Sending money to another user is free, while cash-in and cash-out may incur a small fee. Check the Pricing page for details.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Reach out via our Contact page, email us at support@digitalwallet.com, or call our helpline at +880-123-456-7890. We're available 24/7 to assist you.",
  },
  {
    question: "Can I use the wallet on multiple devices?",
    answer:
      "Yes, our service is fully responsive and accessible on desktops, tablets, and mobile devices. Your account syncs seamlessly across all platforms.",
  },
];

export default function FAQ() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for skeleton effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Got questions about our Digital Wallet? Find answers to common
            queries below or reach out to our support team.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full max-w-3xl mx-auto" />
              <Skeleton className="h-12 w-full max-w-3xl mx-auto" />
              <Skeleton className="h-12 w-full max-w-3xl mx-auto" />
              <Skeleton className="h-12 w-full max-w-3xl mx-auto" />
            </div>
          ) : (
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Still Have Questions?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our support team is here to help you 24/7. Reach out via email
                or phone for personalized assistance.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <a href="/contact" className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Us
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="tel:+8801234567890"
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
