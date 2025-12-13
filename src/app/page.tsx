// app/page.tsx
import Hero from '@/app/components/Hero';
import Features from '@/app/components/Features';
import WhyChooseUs from '@/app/components/WhyChooseUs';
import Security from '@/app/components/Security';
import CTASection from '@/app/components/CTASection';
import Footer from '@/app/components/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <WhyChooseUs />
      <Security />
      <CTASection />
      <Footer />
    </>
  );
}