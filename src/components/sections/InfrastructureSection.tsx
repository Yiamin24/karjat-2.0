'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Reveal hook ── */
const useReveal = (delay = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => el.classList.add('is-visible'), delay);
        obs.unobserve(el);
      }
    }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
};

/* ── Amenity data (sorted by Display Order) ── */
const AMENITIES = [
  {
    order: 1, name: 'Grand Entrance Gate', category: 'Security & Access',
    desc: 'A majestic, artistically crafted entrance gate, designed to reflect the estate\'s grandeur and provide a secure, welcoming threshold.',
    image: 'https://static.wixstatic.com/media/cef78c_45476285e7ff450fbe30fde9f487c511~mv2.png',
  },
  {
    order: 2, name: 'Paved Internal Roads', category: 'Infrastructure',
    desc: 'Smooth, well-maintained internal roads winding through the estate, offering seamless connectivity while blending harmoniously with the natural landscape.',
    image: 'https://static.wixstatic.com/media/cef78c_27ee7e8cec764c619440da740723f321~mv2.png',
  },
  {
    order: 3, name: 'Secure Perimeter Fencing', category: 'Security',
    desc: 'Discreet yet robust perimeter fencing, ensuring privacy and security for all residents without compromising the estate\'s natural beauty.',
    image: 'https://static.wixstatic.com/media/cef78c_88f82ff3349a48bfb220ffe6fe5f25ea~mv2.png',
  },
  {
    order: 4, name: '24/7 Manned Security', category: 'Security',
    desc: 'Round-the-clock professional security personnel and advanced surveillance systems to guarantee the safety and tranquility of your private sanctuary.',
    image: 'https://static.wixstatic.com/media/cef78c_8f49cc68b8844d2b8159617f9d50297c~mv2.png',
  },
  {
    order: 5, name: 'Exquisite Landscaped Gardens', category: 'Nature & Leisure',
    desc: 'Lush, meticulously designed gardens featuring indigenous flora, serene pathways, and tranquil seating areas, perfect for contemplation and connection with nature.',
    image: 'https://static.wixstatic.com/media/cef78c_8f73492c5b9745b99f8e86678551fcaa~mv2.png',
  },
  {
    order: 6, name: 'Serene Water Features', category: 'Nature & Leisure',
    desc: 'Elegant water features, including cascading falls and reflective ponds, enhancing the estate\'s natural ambiance and providing soothing sounds.',
    image: 'https://static.wixstatic.com/media/cef78c_242e14f1bd094ead95a705719e7614a3~mv2.png',
  },
  {
    order: 7, name: 'Uninterrupted Power Supply', category: 'Infrastructure',
    desc: 'State-of-the-art power backup systems ensuring continuous and reliable electricity, even during outages, for absolute comfort and convenience.',
    image: 'https://static.wixstatic.com/media/cef78c_c766336c40a641078c96ea861f8051e2~mv2.png',
  },
  {
    order: 8, name: 'Concealed Utility Networks', category: 'Infrastructure',
    desc: 'All essential utilities, including electricity and communication lines, are meticulously laid underground to preserve the pristine visual aesthetics of the estate.',
    image: 'https://static.wixstatic.com/media/cef78c_4fca4d1056224d2fb1ceb563659733e5~mv2.png',
  },
];

/* ── SVG icons for the icon strip (matches original Karjat Blooms layout) ── */
const IconStrip = [
  {
    label: 'Grand\nEntrance', svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 21h18M5 21V10M19 21V10M3 10l9-7 9 7M9 21V14h6v7" />
      </svg>
    ),
  },
  {
    label: 'Internal\nRoads', svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M5 21L9 3h6l4 18M9 3h6M11 9h2M11 14h2" />
      </svg>
    ),
  },
  {
    label: 'Landscaped\nGardens', svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22V11M12 11C12 6 7 3 4 5c3 0 5.5 2 8 6zM12 11C12 6 17 3 20 5c-3 0-5.5 2-8 6zM5 22c0-4 3-7 7-7" />
      </svg>
    ),
  },
  {
    label: '24/7\nSecurity', svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22s8-5 8-11V5l-8-3-8 3v6c0 6 8 11 8 11z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Water\nFeatures', svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M2 16c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
        <path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
        <path d="M12 3v5" /><path d="M9 5l3-3 3 3" />
      </svg>
    ),
  },
  {
    label: 'Power\nSupply', svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

/* ── Category icon (shown in slide bottom-left) ── */
const CategoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

export default function InfrastructureSection() {
  const headerRef = useReveal(0);
  const iconRef   = useReveal(150);
  const sliderRef = useReveal(200);
  const thumbRef  = useReveal(300);

  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + AMENITIES.length) % AMENITIES.length);
  const next = () => setActive((a) => (a + 1) % AMENITIES.length);

  const item = AMENITIES[active];

  return (
    <section id="amenities" className="relative w-full bg-[#0d3320] overflow-hidden">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      <div className="absolute inset-0 leaf-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-24 md:py-32">

        {/* ══════════════════════════════════
            HEADER — title left, counter right
        ══════════════════════════════════ */}
        <div ref={headerRef} className="reveal-on-scroll flex items-end justify-between mb-14">
          <div className="flex items-baseline gap-5">
            <span
              className="font-heading leading-none select-none flex-shrink-0"
              style={{ fontSize: '5rem', color: 'transparent', WebkitTextStroke: '1px #d4af37', opacity: 0.15, lineHeight: 1 }}
            >
              04
            </span>
            <div>
              <p className="font-paragraph text-[10px] tracking-[0.4em] uppercase text-[#d4af37] mb-2">
                Amenities
              </p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#f5f1e8] leading-tight">
                Estate<br />
                <em className="not-italic text-[#d4af37]">Amenities</em>
              </h2>
            </div>
          </div>

          {/* Prev / Counter / Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 flex items-center justify-center border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#d4af37] transition-all duration-300"
              aria-label="Previous"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="font-paragraph text-xs text-[#f5f1e8]/40 tracking-widest tabular-nums min-w-[52px] text-center">
              {String(active + 1).padStart(2, '0')} / {String(AMENITIES.length).padStart(2, '0')}
            </span>
            <button
              onClick={next}
              className="w-11 h-11 flex items-center justify-center border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#d4af37] transition-all duration-300"
              aria-label="Next"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════
            ICON STRIP — evenly spread full width
        ══════════════════════════════════ */}
        <div ref={iconRef} className="reveal-on-scroll mb-10">
          <div className="flex items-start justify-between w-full">
            {IconStrip.map(({ label, svg }, i) => (
              <div key={i} className="group flex flex-col items-center gap-3 cursor-default">
                <div className="w-16 h-16 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]/60 group-hover:border-[#d4af37] group-hover:text-[#d4af37] group-hover:bg-[#d4af37]/8 transition-all duration-300">
                  {svg}
                </div>
                <span className="font-paragraph text-[8px] tracking-[0.2em] uppercase text-[#f5f1e8]/40 group-hover:text-[#d4af37]/70 transition-colors text-center leading-[1.6] max-w-[72px]">
                  {label.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            FULL-WIDTH SLIDER
        ══════════════════════════════════ */}
        <div ref={sliderRef} className="reveal-on-scroll relative border border-[#d4af37]/20 overflow-hidden mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            >
              {/* Slide image */}
              <div className="relative h-[420px] sm:h-[520px] md:h-[600px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[3s]"
                />
                {/* Gradient: dark bottom-left for text, transparent top-right */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d3320]/95 via-[#0d3320]/35 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d3320]/60 via-transparent to-transparent" />
              </div>

              {/* Slide text overlay — bottom left */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                {/* Category row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="border border-[#d4af37]/50 p-1.5 text-[#d4af37]">
                    <CategoryIcon />
                  </div>
                  <span className="font-paragraph text-[9px] tracking-[0.4em] uppercase text-[#d4af37]">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#f5f1e8] leading-tight mb-3">
                  {item.name}
                </h3>

                {/* Gold rule */}
                <div className="h-px w-10 bg-[#d4af37] mb-4" />

                {/* Description */}
                <p className="font-paragraph text-sm md:text-base text-[#f5f1e8]/70 leading-relaxed max-w-xl">
                  {item.desc}
                </p>

                {/* Dot indicators — bottom right */}
                <div className="absolute bottom-8 right-8 md:right-12 flex items-center gap-2">
                  {AMENITIES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active
                          ? 'w-8 bg-[#d4af37]'
                          : 'w-2 bg-[#d4af37]/25 hover:bg-[#d4af37]/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ══════════════════════════════════
            THUMBNAIL TABS — individual bordered boxes, 4 per row
        ══════════════════════════════════ */}
        <div ref={thumbRef} className="reveal-on-scroll grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {AMENITIES.map((a, i) => (
            <button
              key={a.order}
              onClick={() => setActive(i)}
              className={`group text-left px-5 py-5 border-2 transition-all duration-300 ${
                i === active
                  ? 'border-[#d4af37] bg-[#d4af37]/8'
                  : 'border-[#d4af37]/35 hover:border-[#d4af37]/70 hover:bg-[#1a5c3a]/20'
              }`}
            >
              {/* Gold top rule on active */}
              {i === active && (
                <div className="h-0.5 w-full bg-[#d4af37] mb-3" />
              )}
              <span className={`font-paragraph text-[9px] sm:text-[10px] tracking-[0.2em] uppercase leading-relaxed transition-colors duration-300 ${
                i === active
                  ? 'text-[#d4af37]'
                  : 'text-[#f5f1e8]/55 group-hover:text-[#f5f1e8]/85'
              }`}>
                {a.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
