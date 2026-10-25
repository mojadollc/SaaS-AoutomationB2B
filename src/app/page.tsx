import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import LogoBar from "@/components/landing/LogoBar";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Industries from "@/components/landing/Industries";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Aurex – AI Automation Platform | Automate Customer Support, Bookings & Lead Follow-Up",
  description: "Aurex deploys AI agents that handle customer support, appointment bookings, lead follow-ups, and business reports 24/7. Start free — no credit card required. Trusted by 10,000+ businesses.",
  alternates: { canonical: "https://aurex.payroo.xyz" },
  openGraph: { url: "https://aurex.payroo.xyz" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LogoBar />
      <Features />
      <HowItWorks />
      <Industries />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}
