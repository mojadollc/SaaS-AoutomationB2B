import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import LogoBar from "@/components/landing/LogoBar";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Industries from "@/components/landing/Industries";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

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
