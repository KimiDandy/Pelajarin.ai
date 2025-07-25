import InteractiveBackground from '@/components/shared/InteractiveBackground';
import LandingNavbar from '@/components/shared/LandingNavbar';
import HeroSection from '@/components/shared/HeroSection';
import FeaturesSection from '@/components/shared/FeaturesSection';
import HowItWorksSection from '@/components/shared/HowItWorksSection';
import TestimonialsSection from '@/components/shared/TestimonialsSection';
import FAQSection from '@/components/shared/FAQSection';
import FinalCTASection from '@/components/shared/FinalCTASection';
import Footer from '@/components/shared/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <InteractiveBackground />
      <LandingNavbar />
      <main className="flex-grow relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
