'use client';

import { useRef, useEffect } from 'react';

const useReveal = (delay = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('is-visible'), delay); obs.unobserve(el); }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
};

const AMENITIES = [
  {
    order: 1, name: 'Grand Entrance Gate', category: 'Security & Access',
    desc: "A majestic entrance gate reflecting the estate's grandeur and providing a secure, welcoming threshold.",
    image: 'https://static.wixstatic.com/media/cef78c_45476285e7ff450fbe30fde9f487c511~mv2.png',
  },
  {
    order: 2, name: 'Paved Internal Roads', category: 'Infrastructure',
    desc: 'Smooth internal roads winding through the estate, blending connectivity with the natural landscape.',
    image: 'https://static.wixstatic.com/media/cef78c_27ee7e8cec764c619440da740723f321~mv2.png',
  },
  {
    order: 3, name: 'Secure Perimeter Fencing', category: 'Security',
    desc: 'Discreet yet robust fencing ensuring privacy and security without compromising natural beauty.',
    image: 'https://static.wixstatic.com/media/cef78c_88f82ff3349a48bfb220ffe6fe5f25ea~mv2.png',
  },
  {
    order: 4, name: '24/7 Manned Security', category: 'Security',
    desc: 'Round-the-clock personnel and surveillance systems guaranteeing safety and tranquility.',
    image: 'https://static.wixstatic.com/media/cef78c_8f49cc68b8844d2b8159617f9d50297c~mv2.png',
  },
  {
    order: 5, name: 'Landscaped Gardens', category: 'Nature & Leisure',
    desc: 'Meticulously designed gardens with indigenous flora, pathways, and tranquil seating areas.',
    image: 'https://static.wixstatic.com/media/cef78c_8f73492c5b9745b99f8e86678551fcaa~mv2.png',
  },
  {
    order: 6, name: 'Serene Water Features', category: 'Nature & Leisure',
    desc: 'Cascading falls and reflective ponds enhancing the natural ambiance throughout the estate.',
    image: 'https://static.wixstatic.com/media/cef78c_242e14f1bd094ead95a705719e7614a3~mv2.png',
  },
  {
    order: 7, name: 'Uninterrupted Power Supply', category: 'Infrastructure',
    desc: 'State-of-the-art backup systems ensuring continuous electricity for absolute comfort.',
    image: 'https://static.wixstatic.com/media/cef78c_c766336c40a641078c96ea861f8051e2~mv2.png',
  },
  {
    order: 8, name: 'Concealed Utility Networks', category: 'Infrastructure',
    desc: 'All utilities laid underground to preserve the pristine visual aesthetics of the estate.',
    image: 'https://static.wixstatic.com/media/cef78c_4fca4d1056224d2fb1ceb563659733e5~mv2.png',
  },
];

// Duplicate for seamless loop
const ITEMS = [...AMENITIES, ...AMENITIES];

export default function InfrastructureSection() {
  const headerRef  = useReveal(0);
  const trackRef   = useRef<HTMLDivElement>(null);

  return (
    <section id="amenities" className="relative w-full bg-[#022921] overflow-hidden">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#A8874A]/30 to-transparent" />

      <div className="relative z-10 max-w-[120rem] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-12 md:pt-16 pb-12 md:pb-16">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="reveal-on-scroll flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 md:mb-14">
          <div className="flex items-baseline gap-4">
            <span
              className="font-heading select-none flex-shrink-0 hidden sm:block"
              style={{ fontSize: '4rem', color: 'transparent', WebkitTextStroke: '1px #A8874A', opacity: 0.15, lineHeight: 1 }}
            >04</span>
            <div>
              <p className="font-label text-[9px] tracking-[0.5em] uppercase text-[#A8874A] mb-2">Estate Amenities</p>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#EEE4DA] leading-[1]">
                Crafted for<br />
                <span style={{ color: '#A8874A' }}>Extraordinary Living</span>
              </h2>
            </div>
          </div>
          <p className="font-paragraph text-sm text-[#EEE4DA]/45 max-w-[280px] leading-relaxed border-l border-[#A8874A]/30 pl-4">
            Every detail of Karjat Blooms is designed to elevate daily life — from grand entrances to serene gardens.
          </p>
        </div>

      </div>

      {/* ── CAROUSEL — full bleed, outside container for edge-to-edge ── */}
      <div
        className="relative w-full overflow-hidden"
        // Pause on hover
        onMouseEnter={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'; }}
        onMouseLeave={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running'; }}
      >
        {/* Left + right fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#022921] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#022921] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="flex gap-4 w-max"
          style={{
            animation: 'marquee 40s linear infinite',
          }}
        >
          {ITEMS.map((a, i) => (
            <div
              key={i}
              className="group relative flex-shrink-0 w-[280px] sm:w-[320px] border border-[#44564C] hover:border-[#A8874A]/60 bg-[#01352A]/40 hover:bg-[#01352A]/70 transition-all duration-500 overflow-hidden"
            >
              {/* Image — fixed height, fully visible, object-cover */}
              <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.image}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Number badge */}
                <div className="absolute top-3 left-3 bg-[#022921]/70 backdrop-blur-sm border border-[#44564C] px-2.5 py-1">
                  <span className="font-label text-[8px] tracking-[0.3em] uppercase text-[#A8874A]">
                    {String(a.order).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5">
                <p className="font-label text-[8px] tracking-[0.35em] uppercase text-[#A8874A]/70 mb-2">
                  {a.category}
                </p>
                <h4 className="font-heading text-[#EEE4DA] text-base leading-snug mb-2">
                  {a.name}
                </h4>
                <p className="font-paragraph text-[11px] text-[#EEE4DA]/40 leading-relaxed">
                  {a.desc}
                </p>
              </div>

              {/* Bottom gold accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A8874A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe injected via style tag — Tailwind can't do custom animations without config */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="pb-12 md:pb-16" />
    </section>
  );
}
