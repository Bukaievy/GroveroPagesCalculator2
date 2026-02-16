import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Calculator } from '@/components/Calculator';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Calculator />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
