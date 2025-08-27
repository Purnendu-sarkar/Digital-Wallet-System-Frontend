import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Fade, Slide } from "react-awesome-reveal";
import { Phone, Mail, Globe } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      toast.success("✅ Message sent! Our support team will contact you soon.");
      setSubmitted(false);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 2000);
  };

  return (
    <section className="py-20">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <Fade direction="up" triggerOnce>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
              Get in Touch
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Have a question about your wallet, transactions, or account? We’re
              here to help you 24/7 with any support you need.
            </p>
          </div>
        </Fade>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <Fade direction="left" cascade triggerOnce damping={0.2}>
            <div className="flex flex-col gap-6">
              <Card className="shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <Phone className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground">01409-012843</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <Mail className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:dsr102.purnendu@gmail.com"
                      className="text-muted-foreground underline"
                    >
                      dsr102.purnendu@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <Globe className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">Website</p>
                    <a
                      href="https://digital-wallet-system-frontend.vercel.app"
                      target="_blank"
                      className="text-muted-foreground underline"
                    >
                      digitalwallet.com
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Fade>

          {/* Contact Form */}
          <Slide direction="right" triggerOnce>
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full flex-col gap-6 rounded-xl border p-8 shadow-lg bg-card"
            >
              <div className="flex gap-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitted}>
                {submitted ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Slide>
        </div>
      </div>
    </section>
  );
}
