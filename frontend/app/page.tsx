import InteractiveBackground from '@/components/shared/InteractiveBackground';
import LandingNavbar from '@/components/shared/LandingNavbar';
import HeroSection from '@/components/shared/HeroSection';
import StatsSection from '@/components/shared/StatsSection';
import FeaturesSection from '@/components/shared/FeaturesSection';
import HowItWorksSection from '@/components/shared/HowItWorksSection';
import TestimonialsSection from '@/components/shared/TestimonialsSection';
import FAQSection from '@/components/shared/FAQSection';
import FinalCTASection from '@/components/shared/FinalCTASection';
import Footer from '@/components/shared/Footer';
import FloatingParticles from '@/components/shared/FloatingParticles';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <InteractiveBackground />
      <FloatingParticles />
      <LandingNavbar />
      <main className="flex-grow relative z-10">
        <HeroSection />
        <div className="cinematic-transition">
          <StatsSection />
        </div>
        <div className="cinematic-transition cinematic-transition-top">
          <FeaturesSection />
        </div>
        <div className="cinematic-transition">
          <HowItWorksSection />
        </div>
        <div className="cinematic-transition cinematic-transition-top">
          <TestimonialsSection />
        </div>
        <div className="cinematic-transition">
          <FAQSection />
        </div>
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
