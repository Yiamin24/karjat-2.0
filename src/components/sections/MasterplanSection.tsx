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

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
  </svg>
);

const keyPoints = [
  'Thoughtfully designed villa plots with optimal privacy spacing',
  'Integrated green corridors and nature preserves',
  'World-class recreational facilities and club amenities',
  'Sustainable infrastructure with solar and rainwater systems',
  '24/7 gated security with smart surveillance',
  'Landscaped internal roads with pedestrian walkways',
];

export default function MasterplanSection({ onViewMasterPlan }: { onViewMasterPlan: () => void }) {
  const r1 = useReveal(0), r2 = useReveal(200), r3 = useReveal(350), r4 = useReveal(100), r5 = useReveal(500);

  return (
    <section id="masterplan" className="relative w-full bg-[#01352A] overflow-hidden">
      <div className="absolute inset-0 leaf-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#A8874A]/25 to-transparent" />

      <div className="relative z-10 max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-14 md:py-20">

        <div ref={r1} className="reveal-on-scroll flex items-baseline gap-5 mb-8">
          <span className="font-heading leading-none select-none flex-shrink-0"
            style={{ fontSize: '5rem', color: 'transparent', WebkitTextStroke: '1px #A8874A', opacity: 0.2, lineHeight: 1 }}>06</span>
          <div>
            <p className="font-label text-[10px] tracking-[0.35em] uppercase text-[#A8874A] mb-2">Layout</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#EEE4DA] leading-tight">
              Master<br /><em className="not-italic text-[#A8874A]">Plan</em>
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div className="lg:col-span-5 space-y-8">
            <div ref={r2} className="reveal-on-scroll">
              <p className="font-paragraph text-base md:text-lg text-[#EEE4DA]/65 leading-relaxed border-l-2 border-[#A8874A]/40 pl-6">
                Every element of Karjat Blooms has been meticulously planned to achieve a harmonious coexistence of luxury and nature. Our master plan ensures that each plot benefits from privacy, views, and access to the full breadth of estate amenities.
              </p>
            </div>
            <div ref={r3} className="reveal-on-scroll space-y-3">
              {keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#A8874A] group-hover:scale-150 transition-transform duration-300" />
                  <p className="font-paragraph text-sm md:text-base text-[#EEE4DA]/65 leading-relaxed group-hover:text-[#EEE4DA]/85 transition-colors duration-300">{point}</p>
                </div>
              ))}
            </div>
            <div ref={r5} className="reveal-on-scroll pt-4">
              <button onClick={onViewMasterPlan}
                className="group flex items-center gap-4 font-label text-xs tracking-[0.25em] uppercase text-[#A8874A] hover:text-[#EEE4DA] transition-colors duration-300 border border-[#44564C] hover:border-[#A8874A] px-6 py-4">
                <ZoomIcon />
                <span>View Full Master Plan</span>
                <span className="w-0 h-px bg-current group-hover:w-8 transition-all duration-300" />
              </button>
            </div>
          </div>

          {/* Right: image */}
          <div ref={r4} className="reveal-on-scroll lg:col-span-7">
            <button onClick={onViewMasterPlan}
              className="relative w-full group border border-[#44564C] hover:border-[#A8874A]/60 transition-all duration-500 p-0 bg-transparent"
              aria-label="View master plan">
              <div className="relative w-full" style={{ aspectRatio: '1152 / 896' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://static.wixstatic.com/media/cef78c_9d10890449a24efab942b1644b09f8e2~mv2.jpg"
                  alt="Karjat Blooms Master Plan Layout"
                  className="w-full h-full object-contain" />
              </div>
              <div className="absolute inset-0 bg-[#01352A]/0 group-hover:bg-[#01352A]/25 transition-all duration-500 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-[#A8874A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#01352A]/60 text-[#A8874A]">
                  <ZoomIcon />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#01352A]/80 to-transparent">
                <p className="font-label text-[10px] tracking-[0.3em] uppercase text-[#A8874A]">Click to enlarge</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
