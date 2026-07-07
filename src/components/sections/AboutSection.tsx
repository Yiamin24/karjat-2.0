'use client';

import React, { useRef, useEffect } from 'react';

const useReveal = (delay = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('is-visible'), delay); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
};

export default function AboutSection() {
  const r1 = useReveal(0), r2 = useReveal(150), r3 = useReveal(300), r4 = useReveal(100);

  return (
    <section id="about" className="relative w-full bg-[#f5f1e8] overflow-hidden">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      <div className="max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-24 md:py-36">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div ref={r1} className="reveal-on-scroll flex items-baseline gap-4 mb-10">
              <span className="font-heading leading-none select-none" style={{ fontSize: '6rem', color: 'transparent', WebkitTextStroke: '1px #1a5c3a', opacity: 0.15, lineHeight: 1 }}>01</span>
              <div className="h-px w-10 bg-[#1a5c3a]/30 self-center" />
              <span className="font-paragraph text-xs tracking-[0.3em] uppercase text-[#1a5c3a]/60">About the Project</span>
            </div>
            <div ref={r2} className="reveal-on-scroll">
              <h2 className="font-heading text-4xl md:text-5xl xl:text-6xl text-[#1a2e1a] leading-tight mb-8">
                A New Standard<br /><em className="text-[#1a5c3a] not-italic">of Living</em>
              </h2>
            </div>
            <div ref={r3} className="reveal-on-scroll space-y-5">
              <p className="font-paragraph text-base md:text-lg text-[#1a2e1a]/70 leading-relaxed">
                Karjat Blooms is not merely a residential address — it is a carefully orchestrated estate conceived for those who understand that true luxury is measured in moments of stillness, privacy, and connection to nature.
              </p>
              <p className="font-paragraph text-base md:text-lg text-[#1a2e1a]/70 leading-relaxed">
                Nestled in the verdant Sahyadri foothills, each plot at Karjat Blooms is a canvas upon which your legacy will be written. Designed by Rudram Realty, this project blends ecological mindfulness with the finest estate living — where every sunrise begins from your own sanctuary.
              </p>
              <div className="pt-4 flex items-center gap-4">
                <div className="h-px w-10 bg-[#d4af37]" />
                <span className="font-paragraph text-xs tracking-[0.25em] uppercase text-[#d4af37] font-semibold">Rudram Realty · Est. Karjat</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div ref={r4} className="reveal-on-scroll lg:col-span-6 xl:col-span-7 relative">
            <div className="relative">
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full bg-[#1a5c3a]/10 border border-[#1a5c3a]/20 z-0" />
              <div className="relative z-10 aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://static.wixstatic.com/media/cef78c_4ab6e602267a4b2ab30b818d6f5231a5~mv2.png"
                  alt="Karjat Blooms — Luxury Estate exterior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a]/30 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-6 left-6 z-20 bg-[#f5f1e8]/95 backdrop-blur-sm px-5 py-3 border-l-2 border-[#d4af37]">
                <p className="font-heading text-[#1a5c3a] text-lg leading-tight">Karjat, Maharashtra</p>
                <p className="font-paragraph text-[10px] tracking-[0.2em] uppercase text-[#1a5c3a]/60 mt-0.5">Sahyadri Foothills · Private Estate</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
