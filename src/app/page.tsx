import HeroSection from "@/components/home/HeroSection";
import AudienceSections from "@/components/home/AudienceSections";
import Differentiators from "@/components/home/Differentiators";
import HowWeWork from "@/components/home/HowWeWork";
import Testimonials from "@/components/home/Testimonials";
import EbookSection from "@/components/home/EbookSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AudienceSections />
      <Differentiators />
      <HowWeWork />
      <Testimonials />
      <EbookSection />
      <CTASection />
    </>
  );
}
