import Hero from "@/components/home/Hero";
import StatsBand from "@/components/home/StatsBand";
import HowItWorks from "@/components/home/HowItWorks";
import Demo from "@/components/home/Demo";
import Features from "@/components/home/Features";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <main className="home h-full w-full overflow-hidden">
      <Hero />
      <StatsBand />
      <HowItWorks />
      <Demo />
      <Features />
      <CallToAction />
    </main>
  );
}
