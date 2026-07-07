'use client';

import { useRef, useEffect } from 'react';

/* ── Reveal hook ── */
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

/* ── Connectivity data (hardcoded — from existing project) ── */
const CONNECTIVITY = [
  { label: 'Mumbai via Expressway',  value: '~90 km · ~1.5 hrs' },
  { label: 'Pune via NH-48',         value: '~65 km · ~1.5 hrs' },
  { label: 'Karjat Railway Station', value: '5 km · 10 mins' },
  { label: 'Mumbai Airport',         value: '~100 km · ~2 hrs' },
];

/* ── Location Highlights from CSV ── */
const HIGHLIGHTS = [
  {
    name: 'Bhivpuri Waterfalls',
    category: 'Nature & Recreation',
    distance: '8 km',
    travel: '15 minutes',
    benefit: 'Easy access to a natural wonder, perfect for serene escapes and outdoor activities.',
    map: 'https://maps.google.com/?q=Bhivpuri+Waterfalls',
  },
  {
    name: 'ND\'s Film World',
    category: 'Leisure & Entertainment',
    distance: '15 km',
    travel: '25 minutes',
    benefit: 'Proximity to a renowned film studio and entertainment complex for cultural experiences.',
    map: 'https://maps.google.com/?q=ND\'s+Film+World',
  },
  {
    name: 'Reputable Schools',
    category: 'Education',
    distance: '25 km',
    travel: '40 minutes',
    benefit: 'Access to quality educational institutions ensuring a bright future for families.',
    map: 'https://maps.google.com/?q=Delhi+Public+School+Khopoli',
  },
  {
    name: 'Major Hospitals',
    category: 'Healthcare',
    distance: '12 km',
    travel: '20 minutes',
    benefit: 'Assurance of immediate medical care with well-equipped healthcare facilities nearby.',
    map: 'https://maps.google.com/?q=Karjat+Hospital',
  },
  {
    name: 'Karjat Railway Station',
    category: 'Connectivity',
    distance: '10 km',
    travel: '20 minutes',
    benefit: 'Seamless rail access to Mumbai and Pune for daily commutes or weekend getaways.',
    map: 'https://maps.google.com/?q=Karjat+Railway+Station',
  },
];

/* ── Category icon ── */
const CategoryIcon = ({ cat }: { cat: string }) => {
  const c = cat.toLowerCase();
  if (c.includes('nature') || c.includes('recreation')) return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 22V11M12 11C12 6 7 3 4 5c3 0 5.5 2 8 6zM12 11C12 6 17 3 20 5c-3 0-5.5 2-8 6zM5 22c0-4 3-7 7-7" />
    </svg>
  );
  if (c.includes('connect') || c.includes('rail')) return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="4" y="3" width="16" height="14" rx="3" /><path d="M4 11h16M8 19l-2 2M16 19l2 2M12 17v2" />
    </svg>
  );
  if (c.includes('health')) return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zM12 8v8M8 12h8" />
    </svg>
  );
  if (c.includes('edu')) return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22 10L12 4 2 10l10 6 10-6zM6 12v5c3 2 9 2 12 0v-5" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 22s-8-5.686-8-12a8 8 0 0116 0c0 6.314-8 12-8 12z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
};

export default function LocationSection() {
  const headerRef  = useReveal(0);
  const leftRef    = useReveal(150);
  const rightRef   = useReveal(100);
  const tableRef   = useReveal(250);

  return (
    <section id="location" className="relative w-full bg-[#0d3320] overflow-hidden">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      <div className="absolute inset-0 leaf-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-24 md:py-36">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="reveal-on-scroll mb-20">
          <div className="flex items-baseline gap-5 mb-6">
            <span className="font-heading leading-none select-none flex-shrink-0"
              style={{ fontSize: '5rem', color: 'transparent', WebkitTextStroke: '1px #d4af37', opacity: 0.15, lineHeight: 1 }}>
              02
            </span>
            <div>
              <p className="font-paragraph text-[10px] tracking-[0.4em] uppercase text-[#d4af37] mb-2">
                Location & Connectivity
              </p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#f5f1e8] leading-tight">
                Strategic<br />
                <em className="not-italic text-[#d4af37]">Proximity</em>
              </h2>
            </div>
          </div>
          <p className="font-paragraph text-base md:text-lg text-[#f5f1e8]/55 leading-relaxed max-w-2xl border-l-2 border-[#d4af37]/30 pl-5">
            Karjat Blooms offers the rare privilege of total seclusion paired with effortless city access — positioned at the confluence of expressways, rail, and nature.
          </p>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">

          {/* Left: connectivity + highlights */}
          <div ref={leftRef} className="reveal-on-scroll lg:col-span-5 space-y-10">

            {/* Key distances */}
            <div>
              <p className="font-paragraph text-[9px] tracking-[0.4em] uppercase text-[#d4af37] mb-5">
                Key Distances
              </p>
              {CONNECTIVITY.map((c, i) => (
                <div key={i}
                  className="flex items-center justify-between py-4 border-b border-[#d4af37]/10 group hover:border-[#d4af37]/30 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] flex-shrink-0" />
                    <span className="font-paragraph text-sm text-[#f5f1e8]/65 group-hover:text-[#f5f1e8] transition-colors">
                      {c.label}
                    </span>
                  </div>
                  <span className="font-heading text-sm text-[#d4af37]">{c.value}</span>
                </div>
              ))}
            </div>

            {/* Highlights grid */}
            <div>
              <p className="font-paragraph text-[9px] tracking-[0.4em] uppercase text-[#d4af37] mb-5">
                Nearby Landmarks
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HIGHLIGHTS.map((h, i) => (
                  <a
                    key={i}
                    href={h.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-[#1a5c3a]/20 border border-[#d4af37]/15 p-5 hover:border-[#d4af37]/50 hover:bg-[#1a5c3a]/35 transition-all duration-400 block"
                  >
                    <div className="absolute top-0 left-0 w-0.5 h-0 bg-[#d4af37] group-hover:h-full transition-all duration-400" />
                    <div className="flex items-center gap-2 mb-2 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors">
                      <CategoryIcon cat={h.category} />
                      <span className="font-paragraph text-[8px] tracking-[0.25em] uppercase">{h.category}</span>
                    </div>
                    <h4 className="font-heading text-sm text-[#f5f1e8] leading-tight mb-1">{h.name}</h4>
                    <p className="font-paragraph text-[10px] text-[#d4af37]/70 mb-1.5">
                      {h.distance} · {h.travel}
                    </p>
                    <p className="font-paragraph text-[10px] text-[#f5f1e8]/45 leading-relaxed">{h.benefit}</p>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right: map image */}
          <div ref={rightRef} className="reveal-on-scroll lg:col-span-7">
            <div className="relative border border-[#d4af37]/25 overflow-hidden">
              <div className="aspect-[16/11] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.wixstatic.com/media/cef78c_19d02230db324c10b652fee80557945f~mv2.png"
                  alt="Karjat Blooms Location Map"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2.5s]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d3320]/15 via-transparent to-[#0d3320]/60 pointer-events-none" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0d3320]/90 to-transparent">
                <div className="flex items-center gap-3 text-[#d4af37]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
                    <path d="M12 22s-8-5.686-8-12a8 8 0 0116 0c0 6.314-8 12-8 12z" /><circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <div>
                    <p className="font-heading text-base text-[#f5f1e8]">Karjat, Raigad District</p>
                    <p className="font-paragraph text-[10px] text-[#f5f1e8]/45 tracking-widest mt-0.5">
                      Maharashtra · India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── STATS STRIP ── */}
        <div ref={tableRef} className="reveal-on-scroll grid grid-cols-2 md:grid-cols-4 border border-[#d4af37]/20">
          {[
            { val: '90 km', lbl: 'From Mumbai' },
            { val: '65 km', lbl: 'From Pune' },
            { val: '5 km', lbl: 'Karjat Station' },
            { val: '5+', lbl: 'Nearby Landmarks' },
          ].map(({ val, lbl }, i) => (
            <div key={i} className={`p-8 text-center ${i < 3 ? 'border-r border-[#d4af37]/20' : ''} border-b md:border-b-0 border-[#d4af37]/20`}>
              <div className="font-heading text-3xl md:text-4xl text-[#d4af37] leading-none mb-2">{val}</div>
              <div className="font-paragraph text-[9px] tracking-[0.3em] uppercase text-[#f5f1e8]/40">{lbl}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
