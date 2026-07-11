'use client';

import { useState, useEffect } from 'react';
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
  const [showMasterPlanModal, setShowMasterPlanModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContactForm(true), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen selection:bg-[#A8874A] selection:text-[#022921]">
      <Navigation onEnquireClick={() => setShowContactForm(true)} />

      <HeroSection onEnquireClick={() => setShowContactForm(true)} />

      <AboutSection />
      <LocationSection />
      <VisionSection />
      <InfrastructureSection />
      <LifestyleSection />
      <MasterplanSection onViewMasterPlan={() => setShowMasterPlanModal(true)} />
      <ContactSection onContactClick={() => setShowContactForm(true)} />

      <MasterPlanModal isOpen={showMasterPlanModal} onClose={() => setShowMasterPlanModal(false)} />
      <ContactFormModal isOpen={showContactForm} onClose={() => setShowContactForm(false)} />
    </div>
  );
}
