'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ClubHouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <path d="M3 21h18M5 21V10M19 21V10M3 10l9-7 9 7M9 21V14h6v7" />
  </svg>
);
const PoolIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <path d="M2 16c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 20c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M16 4h3M19 4v5" /><circle cx="8" cy="6" r="2" /><path d="M8 8v3" />
  </svg>
);
const GardenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <path d="M12 22V11" />
    <path d="M12 11C12 6 7 3 4 5c3 0 5.5 2 8 6z" />
    <path d="M12 11C12 6 17 3 20 5c-3 0-5.5 2-8 6z" />
    <path d="M5 22c0-4 3-7 7-7" />
  </svg>
);
const SecurityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <path d="M12 22s8-5 8-11V5l-8-3-8 3v6c0 6 8 11 8 11z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const RoadAmenityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <path d="M5 21L9 3h6l4 18M9 3h6M11 9h2M11 14h2" />
  </svg>
);
const JoggingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <circle cx="14" cy="4" r="1.5" />
    <path d="M10 8.5l2-2 3 2 2 3h-3M10 8.5L8 13l2 3M13 8.5l1.5 4-2 4" />
  </svg>
);

const staticAmenities = [
  { label: 'Club House', Icon: ClubHouseIcon },
  { label: 'Swimming Pool', Icon: PoolIcon },
  { label: 'Landscaped Gardens', Icon: GardenIcon },
  { label: '24/7 Security', Icon: SecurityIcon },
  { label: 'Internal Roads', Icon: RoadAmenityIcon },
  { label: 'Jogging Track', Icon: JoggingIcon },
];

// Static slide data used when no CMS data is available
const staticSlides = [
  {
    id: 'club', image: 'https://static.wixstatic.com/media/cef78c_4ab6e602267a4b2ab30b818d6f5231a5~mv2.png',
    name: 'Grand Club House', category: 'Clubhouse',
    desc: 'A curated space for leisure, wellness, and social connection — the heart of the Karjat Blooms estate.',
  },
  {
    id: 'pool', image: 'https://static.wixstatic.com/media/cef78c_bc58319c52dd43deaad8b604b2606378~mv2.png',
    name: 'Infinity Pool', category: 'Recreation',
    desc: 'An expansive swimming pool overlooking lush green hills — where every lap feels like a meditation.',
  },
  {
    id: 'garden', image: 'https://static.wixstatic.com/media/cef78c_0fb7f2db0c9c4ed6914ab88cb736da40~mv2.png',
    name: 'Botanical Gardens', category: 'Landscaping',
    desc: 'Meticulously curated native flora woven throughout the estate, celebrating the Sahyadri biodiversity.',
  },
];

type Props = { currentSlide: number; onSlideChange: (i: number) => void };

export default function InfrastructureSection({ currentSlide, onSlideChange }: Props) {
  const r1 = useReveal(0), r2 = useReveal(200);
  const slides = staticSlides;

  return (
    <section id="amenities" className="relative w-full bg-[#0d3320] overflow-hidden">
      <div className="absolute inset-0 leaf-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

      <div className="relative z-10 max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-24 md:py-36">

        {/* Header + nav controls */}
        <div ref={r1} className="reveal-on-scroll flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div className="flex items-baseline gap-5">
            <span className="font-heading leading-none select-none flex-shrink-0"
              style={{ fontSize: '5rem', color: 'transparent', WebkitTextStroke: '1px #d4af37', opacity: 0.18, lineHeight: 1 }}>04</span>
            <div>
              <p className="font-paragraph text-[10px] tracking-[0.35em] uppercase text-[#d4af37] mb-2">Amenities</p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#f5f1e8] leading-tight">
                Estate<br /><em className="not-italic text-[#d4af37]">Amenities</em>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSlideChange((currentSlide - 1 + slides.length) % slides.length)}
              className="w-11 h-11 flex items-center justify-center border border-[#d4af37]/35 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#d4af37] transition-all duration-300" aria-label="Previous">
              <ChevronLeftIcon />
            </button>
            <span className="font-paragraph text-xs text-[#f5f1e8]/40 tracking-widest tabular-nums">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <button onClick={() => onSlideChange((currentSlide + 1) % slides.length)}
              className="w-11 h-11 flex items-center justify-center border border-[#d4af37]/35 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#d4af37] transition-all duration-300" aria-label="Next">
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        {/* Amenity icon strip */}
        <div ref={r2} className="reveal-on-scroll mb-14">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4">
            {staticAmenities.map(({ label, Icon }, i) => (
              <div key={i} className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]/65 group-hover:border-[#d4af37] group-hover:text-[#d4af37] group-hover:bg-[#d4af37]/8 transition-all duration-300">
                  <Icon />
                </div>
                <span className="font-paragraph text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#f5f1e8]/40 group-hover:text-[#d4af37]/70 transition-colors text-center leading-tight max-w-[80px]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="relative h-[400px] md:h-[520px] lg:h-[600px] overflow-hidden border border-[#d4af37]/20">
          {slides.map((slide, idx) => (
            <motion.div key={slide.id} className="absolute inset-0 group"
              initial={{ opacity: 0 }}
              animate={{ opacity: idx === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              style={{ pointerEvents: idx === currentSlide ? 'auto' : 'none' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.image} alt={slide.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d3320]/95 via-[#0d3320]/40 to-transparent" />
              <motion.div className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: idx === currentSlide ? 1 : 0, y: idx === currentSlide ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.25 }}>
                <p className="font-paragraph text-[10px] tracking-[0.3em] uppercase text-[#d4af37]/70 mb-3">{slide.category}</p>
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-[#f5f1e8] mb-3 tracking-wide">{slide.name}</h3>
                <div className="h-px w-10 bg-[#d4af37] mb-4" />
                <p className="font-paragraph text-sm md:text-base text-[#f5f1e8]/75 leading-relaxed max-w-2xl">{slide.desc}</p>
              </motion.div>
            </motion.div>
          ))}
          {/* Dot indicators */}
          <div className="absolute bottom-6 right-8 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button key={i} onClick={() => onSlideChange(i)} aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-[#d4af37]' : 'w-3 bg-[#d4af37]/30 hover:bg-[#d4af37]/50'}`} />
            ))}
          </div>
        </div>

        {/* Thumbnail tabs */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {slides.map((slide, i) => (
            <button key={slide.id} onClick={() => onSlideChange(i)}
              className={`group relative p-4 border text-left transition-all duration-300 ${i === currentSlide ? 'border-[#d4af37]/60 bg-[#d4af37]/8' : 'border-[#d4af37]/15 hover:border-[#d4af37]/40 hover:bg-[#1a5c3a]/20'}`}>
              <div className={`h-0.5 mb-3 transition-all duration-400 ${i === currentSlide ? 'w-full bg-[#d4af37]' : 'w-0 group-hover:w-full bg-[#d4af37]/50'}`} />
              <p className={`font-paragraph text-xs tracking-[0.15em] uppercase leading-snug transition-colors duration-300 ${i === currentSlide ? 'text-[#d4af37]' : 'text-[#f5f1e8]/50 group-hover:text-[#f5f1e8]/80'}`}>
                {slide.name}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
