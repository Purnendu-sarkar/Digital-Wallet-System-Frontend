import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Ayesha from "@/assets/images/team/ayesha.jpg";
import Tanvir from "@/assets/images/team/tanvir.jpg";
import Sadia from "@/assets/images/team/sadia.jpg";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

// Team data (realistic, no placeholders)
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

export default function About() {
  const { data: user } = useUserInfoQuery(null);
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

  // Set document title
  useEffect(() => {
    document.title = "About Us - Digital Wallet";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            variants={itemVariants}
          >
            About Digital Wallet
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-center max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Empowering financial freedom with secure, fast, and accessible
            digital transactions for everyone.
          </motion.p>
          <motion.div
            className="mt-6 flex justify-center"
            variants={itemVariants}
          >
            <Button
              asChild
              className="bg-white text-teal-800 hover:bg-gray-100"
            >
              <a href="/contact">Get in Touch</a>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Story and Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="story" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="story">Our Story</TabsTrigger>
              <TabsTrigger value="mission">Our Mission</TabsTrigger>
            </TabsList>
            <TabsContent value="story">
              <motion.div
                className="mt-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-6 w-6" />
                      Our Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Founded in 2020, Digital Wallet was born out of a vision
                      to bridge the gap between traditional banking and modern
                      digital needs. Starting with a small team in Dhaka, we’ve
                      grown into a trusted platform serving millions across the
                      country. Our journey is driven by a commitment to
                      financial inclusion, enabling users and agents to transact
                      seamlessly, securely, and affordably.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            <TabsContent value="mission">
              <motion.div
                className="mt-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6" />
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our mission is to empower every individual and business
                      with accessible, secure, and innovative financial
                      solutions. We aim to redefine digital payments by
                      prioritizing user trust, agent support, and technological
                      excellence, ensuring everyone can participate in the
                      digital economy.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Call to Action */}

      {!user?.data ? (
        <>
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                variants={itemVariants}
              >
                Join the Digital Wallet Revolution
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-xl mx-auto mb-6"
                variants={itemVariants}
              >
                Be part of a growing community transforming the way we handle
                money. Sign up today or contact us to learn more!
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button asChild size="lg">
                  <a href="/register">Get Started</a>
                </Button>
              </motion.div>
            </div>
          </section>
          <Separator className="my-8" />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
