'use client';

import { useState, useEffect } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import LocationSection from '@/components/sections/LocationSection';
import VisionSection from '@/components/sections/VisionSection';
import InfrastructureSection from '@/components/sections/InfrastructureSection';
import LifestyleSection from '@/components/sections/LifestyleSection';
import MasterplanSection from '@/components/sections/MasterplanSection';
import ContactSection from '@/components/sections/ContactSection';
import MasterPlanModal from '@/components/sections/MasterPlanModal';
import ContactFormModal from '@/components/sections/ContactFormModal';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMasterPlanModal, setShowMasterPlanModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Auto-open contact form after 2.5s (give user time to see the hero)
  useEffect(() => {
    const t = setTimeout(() => setShowContactForm(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <SmoothScroll>
      <div className="min-h-screen overflow-x-hidden selection:bg-[#d4af37] selection:text-[#0d3320]">
        <Navigation onEnquireClick={() => setShowContactForm(true)} />

        {/* Hero occupies 500vh internally — all other sections follow normally */}
        <HeroSection onEnquireClick={() => setShowContactForm(true)} />

        <AboutSection />
        <LocationSection />
        <VisionSection />
        <InfrastructureSection currentSlide={currentSlide} onSlideChange={setCurrentSlide} />
        <LifestyleSection />
        <MasterplanSection onViewMasterPlan={() => setShowMasterPlanModal(true)} />
        <ContactSection onContactClick={() => setShowContactForm(true)} />

        <MasterPlanModal isOpen={showMasterPlanModal} onClose={() => setShowMasterPlanModal(false)} />
        <ContactFormModal isOpen={showContactForm} onClose={() => setShowContactForm(false)} />
      </div>
    </SmoothScroll>
  );
}
