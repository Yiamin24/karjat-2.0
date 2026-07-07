'use client';

import React, { useRef, useEffect } from 'react';

const useReveal = (delay = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('is-visible'), delay); obs.unobserve(el); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
};

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22s-8-5.686-8-12a8 8 0 0116 0c0 6.314-8 12-8 12z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);
const TrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="4" y="3" width="16" height="14" rx="3" /><path d="M4 11h16M8 19l-2 2M16 19l2 2M12 17v2" />
    <circle cx="8.5" cy="7.5" r="1" fill="currentColor" /><circle cx="15.5" cy="7.5" r="1" fill="currentColor" />
  </svg>
);
const RoadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M5 21L9 3M19 21L15 3M9 3h6M5 21h14" /><path d="M12 7v2M12 12v2M12 17v2" />
  </svg>
);
const AirplaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M22 16.5v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2" />
    <path d="M2 9l5-4.5L10.5 7l7-5.5L20 4l-8 7 10 5.5-2 1L12 13l-8.5 4.5-2-1L12 11 2 9z" />
  </svg>
);

const iconForCategory = (category?: string) => {
  if (!category) return <PinIcon />;
  const c = category.toLowerCase();
  if (c.includes('rail') || c.includes('train')) return <TrainIcon />;
  if (c.includes('road') || c.includes('highway') || c.includes('express')) return <RoadIcon />;
  if (c.includes('air') || c.includes('airport')) return <AirplaneIcon />;
  return <PinIcon />;
};

const connectivity = [
  { label: 'Mumbai via Expressway', value: '~90 km · ~1.5 hrs' },
  { label: 'Pune via NH-48', value: '~65 km · ~1.5 hrs' },
  { label: 'Karjat Railway Station', value: '5 km · 10 mins' },
  { label: 'Mumbai Airport', value: '~100 km · ~2 hrs' },
];

const nearbyPlaces = [
  { name: 'Bhimashankar Temple', category: 'nature', distance: '45 km', benefit: 'Sacred Jyotirlinga, pristine forest trails' },
  { name: 'Ulhas River', category: 'nature', distance: '2 km', benefit: 'Riverside camping, rafting & fishing' },
  { name: 'Karjat Station', category: 'rail', distance: '5 km', benefit: 'Central Railway — direct Mumbai trains' },
  { name: 'Mumbai–Pune Expressway', category: 'road', distance: '8 km', benefit: 'Seamless highway access both ways' },
];

export default function LocationSection() {
  const r1 = useReveal(0), r2 = useReveal(150), r3 = useReveal(250), r4 = useReveal(100);

  return (
    <section id="location" className="relative w-full bg-[#0d3320] overflow-hidden">
      <div className="absolute inset-0 leaf-pattern opacity-50 pointer-events-none" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

      <div className="relative z-10 max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-24 md:py-36">
        <div ref={r1} className="reveal-on-scroll flex items-baseline gap-5 mb-16">
          <span className="font-heading leading-none select-none flex-shrink-0"
            style={{ fontSize: '5rem', color: 'transparent', WebkitTextStroke: '1px #d4af37', opacity: 0.2, lineHeight: 1 }}>02</span>
          <div>
            <p className="font-paragraph text-[10px] tracking-[0.35em] uppercase text-[#d4af37] mb-2">Location & Connectivity</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#f5f1e8] leading-tight">
              Strategic<br /><em className="not-italic text-[#d4af37]">Proximity</em>
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="lg:col-span-5 space-y-10">
            <div ref={r2} className="reveal-on-scroll">
              <p className="font-paragraph text-base md:text-lg text-[#f5f1e8]/65 leading-relaxed border-l-2 border-[#d4af37]/40 pl-6">
                Karjat Blooms offers the rare privilege of total seclusion paired with effortless city access. Positioned at the confluence of two expressways and a major rail corridor, the estate keeps you connected — on your own terms.
              </p>
            </div>

            <div ref={r3} className="reveal-on-scroll">
              <p className="font-paragraph text-[10px] tracking-[0.3em] uppercase text-[#d4af37] mb-5">Key Distances</p>
              {connectivity.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-[#d4af37]/10 group hover:border-[#d4af37]/30 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] flex-shrink-0" />
                    <span className="font-paragraph text-sm text-[#f5f1e8]/70 group-hover:text-[#f5f1e8] transition-colors">{p.label}</span>
                  </div>
                  <span className="font-heading text-sm text-[#d4af37]">{p.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nearbyPlaces.map((item, i) => (
                <div key={i} className="group relative bg-[#1a5c3a]/25 border border-[#d4af37]/15 p-5 hover:border-[#d4af37]/45 hover:bg-[#1a5c3a]/40 transition-all duration-500">
                  <div className="absolute top-0 left-0 w-0.5 h-0 bg-[#d4af37] group-hover:h-full transition-all duration-500" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#d4af37] opacity-60 group-hover:opacity-100 transition-opacity">{iconForCategory(item.category)}</span>
                    <h4 className="font-heading text-base text-[#f5f1e8] leading-tight">{item.name}</h4>
                  </div>
                  <p className="font-paragraph text-xs text-[#d4af37]/70 mb-1">{item.distance}</p>
                  <p className="font-paragraph text-xs text-[#f5f1e8]/50 leading-relaxed">{item.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Map */}
          <div ref={r4} className="reveal-on-scroll lg:col-span-7 relative">
            <div className="relative border border-[#d4af37]/25 overflow-hidden">
              <div className="aspect-[16/11] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://static.wixstatic.com/media/cef78c_19d02230db324c10b652fee80557945f~mv2.png"
                  alt="Karjat Blooms Location Map"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d3320]/20 via-transparent to-[#0d3320]/50 pointer-events-none" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0d3320]/90 to-transparent">
                <div className="flex items-center gap-3 text-[#d4af37]">
                  <PinIcon />
                  <div>
                    <p className="font-heading text-base text-[#f5f1e8]">Karjat, Raigad District</p>
                    <p className="font-paragraph text-xs text-[#f5f1e8]/50 tracking-wider">Maharashtra · India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
