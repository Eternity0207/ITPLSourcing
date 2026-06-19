import HeroSection from "@/components/home/HeroSection";
import AudienceSections from "@/components/home/AudienceSections";
import Differentiators from "@/components/home/Differentiators";
import ValueAdded from "@/components/home/ValueAdded";
import Testimonials from "@/components/home/Testimonials";
import EbookSection from "@/components/home/EbookSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AudienceSections />
      <Differentiators />
      <ValueAdded />
      <Testimonials />
      <EbookSection />
      <CTASection />
    </>
  );
}
