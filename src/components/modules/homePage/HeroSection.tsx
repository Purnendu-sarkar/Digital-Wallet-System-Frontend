import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Fade, Slide } from "react-awesome-reveal";
import Logo from "@/assets/icons/digital-wallet.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-28 lg:py-40">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/90 to-background/50" />
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <img
          alt="pattern"
          src={Logo}
          className="opacity-30 [mask-image:radial-gradient(70%_70%_at_center,white,transparent)]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Heading + Subheading */}
          <Fade direction="up" cascade damping={0.15}>
            <div className="mt-10 space-y-6">
              <h1 className="text-balance bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                Move money fast. Securely.
                <br />
                Anywhere in Bangladesh with{" "}
                <span className="underline decoration-primary/40">
                  Digital Wallet
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl">
                Send, receive, cash-in/out, and track every taka with real-time
                insights — all in one secure app.
              </p>
            </div>
          </Fade>

          {/* Buttons */}
          <Slide direction="up">
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="rounded-xl px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/features">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-xl border px-8"
                >
                  See Features
                </Button>
              </Link>
            </div>
          </Slide>
        </div>
      </div>
    </section>
  );
};
