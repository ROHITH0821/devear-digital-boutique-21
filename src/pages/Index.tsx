import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ShopTheLookCarousel from "@/components/ShopTheLook/ShopTheLookCarousel";
import SpinWheel from "@/components/Gamification/SpinWheel";
import { useState, useEffect } from "react";

const Index = () => {
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  useEffect(() => {
    // Show spin wheel popup after 3 seconds for first-time visitors
    const hasSeenWheel = localStorage.getItem('hasSeenSpinWheel');
    if (!hasSeenWheel) {
      const timer = setTimeout(() => {
        setShowSpinWheel(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseSpinWheel = () => {
    setShowSpinWheel(false);
    localStorage.setItem('hasSeenSpinWheel', 'true');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <ShopTheLookCarousel />
        <Newsletter />
      </main>
      <Footer />
      
      <SpinWheel isOpen={showSpinWheel} onClose={handleCloseSpinWheel} />
    </div>
  );
};

export default Index;