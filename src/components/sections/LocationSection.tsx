'use client';

import { useRef, useEffect } from 'react';

const useReveal = (delay = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('is-visible'), delay); obs.unobserve(el); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
};

const DISTANCES = [
  { from: 'Mumbai',         via: 'Expressway',  value: '~90',  unit: 'km', time: '~1.5 hrs' },
  { from: 'Pune',           via: 'NH-48',        value: '~65',  unit: 'km', time: '~1.5 hrs' },
  { from: 'Karjat Station', via: 'Nearest Rail', value: '5',    unit: 'km', time: '10 mins'  },
  { from: 'Mumbai Airport', via: 'CSMI Airport', value: '~100', unit: 'km', time: '~2 hrs'   },
];

const LANDMARKS = [
  {
    name: 'Bhivpuri Waterfalls',
    category: 'Nature & Recreation',
    dist: '8 km', time: '15 min',
    benefit: 'Easy access to a natural wonder, perfect for serene escapes and outdoor activities.',
    map: 'https://maps.google.com/?q=Bhivpuri+Waterfalls',
  },
  {
    name: "ND's Film World",
    category: 'Leisure & Entertainment',
    dist: '15 km', time: '25 min',
    benefit: 'Proximity to a renowned film studio and entertainment complex for cultural experiences.',
    map: "https://maps.google.com/?q=ND's+Film+World",
  },
  {
    name: 'Reputable Schools',
    category: 'Education',
    dist: '25 km', time: '40 min',
    benefit: 'Access to quality educational institutions ensuring a bright future for families.',
    map: 'https://maps.google.com/?q=Delhi+Public+School+Khopoli',
  },
  {
    name: 'Major Hospitals',
    category: 'Healthcare',
    dist: '12 km', time: '20 min',
    benefit: 'Assurance of immediate medical care with well-equipped healthcare facilities nearby.',
    map: 'https://maps.google.com/?q=Karjat+Hospital',
  },
  {
    name: 'Karjat Railway Station',
    category: 'Connectivity',
    dist: '10 km', time: '20 min',
    benefit: 'Seamless rail access to Mumbai and Pune for daily commutes or weekend getaways.',
    map: 'https://maps.google.com/?q=Karjat+Railway+Station',
  },
];

export default function LocationSection() {
  const r1 = useReveal(0);
  const r2 = useReveal(100);
  const r3 = useReveal(180);

  return (
    <section id="location" className="relative w-full bg-[#022921]">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#A8874A]/30 to-transparent" />

      <div className="max-w-[120rem] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-12 md:pt-16 pb-12 md:pb-16 flex flex-col gap-10 md:gap-12">

        {/* ══════════════════════════════════════════════
            ROW 1 — Header
        ══════════════════════════════════════════════ */}
        <div ref={r1} className="reveal-on-scroll flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex items-baseline gap-4">
            <span
              className="font-heading select-none flex-shrink-0 hidden sm:block"
              style={{ fontSize: '4rem', color: 'transparent', WebkitTextStroke: '1px #A8874A', opacity: 0.15, lineHeight: 1 }}
            >02</span>
            <div>
              <p className="font-label text-[9px] tracking-[0.5em] uppercase text-[#A8874A] mb-2">Location & Connectivity</p>
              <h2 className="font-heading text-[2.4rem] md:text-[3rem] text-[#EEE4DA] leading-[1]">
                Strategic <span style={{ color: '#A8874A' }}>Proximity</span>
              </h2>
            </div>
          </div>
          <p className="font-paragraph text-sm text-[#EEE4DA]/45 max-w-[300px] leading-relaxed border-l border-[#A8874A]/30 pl-4">
            Seclusion without isolation — at the confluence of expressways, rail, and nature.
          </p>
        </div>

        {/* ══════════════════════════════════════════════
            ROW 2 — Map (right, 60%) + Distances (left, 40%)
            Mobile: distances on top, map below
        ══════════════════════════════════════════════ */}
        <div ref={r2} className="reveal-on-scroll grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 lg:gap-6">

          {/* LEFT — Key Distances */}
          <div className="flex flex-col gap-3">

            <p className="font-label text-[8.5px] tracking-[0.45em] uppercase text-[#A8874A]">Key Distances</p>

            {/* Distance rows */}
            <div className="border border-[#44564C] divide-y divide-[#44564C]/60">
              {DISTANCES.map((d, i) => (
                <div
                  key={i}
                  className="group relative flex items-center justify-between px-5 py-4 hover:bg-[#01352A]/60 transition-colors duration-300"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#A8874A] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
                  <div>
                    <p className="font-heading text-[#EEE4DA] text-base leading-none">{d.from}</p>
                    <p className="font-label text-[8px] tracking-[0.22em] uppercase text-[#8C968D] mt-1">via {d.via}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="font-heading text-[#A8874A] leading-none" style={{ fontSize: '1.6rem' }}>{d.value}</span>
                      <span className="font-label text-[#A8874A]/80 text-xs font-semibold">{d.unit}</span>
                    </div>
                    <p className="font-label text-[11px] text-[#EEE4DA]/50 font-medium mt-0.5">{d.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Location badge */}
            <div className="flex items-center gap-3 border border-[#44564C] bg-[#01352A]/40 px-5 py-3.5 mt-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="#A8874A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                <path d="M12 22s-8-5.686-8-12a8 8 0 0116 0c0 6.314-8 12-8 12z"/><circle cx="12" cy="10" r="2.5"/>
              </svg>
              <div>
                <p className="font-heading text-[#EEE4DA] text-sm leading-none">Karjat, Raigad District</p>
                <p className="font-label text-[8px] tracking-[0.25em] uppercase text-[#8C968D] mt-0.5">Maharashtra · India</p>
              </div>
            </div>

          </div>

          {/* RIGHT — Map image, full height, fully visible */}
          <div className="relative border border-[#44564C] overflow-hidden min-h-[260px] lg:min-h-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/cef78c_19d02230db324c10b652fee80557945f~mv2.png"
              alt="Karjat Blooms Location Map"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(2,41,33,0.45)] pointer-events-none" />
          </div>

        </div>

        {/* ══════════════════════════════════════════════
            ROW 3 — Nearby Landmarks (5 cards)
        ══════════════════════════════════════════════ */}
        <div ref={r3} className="reveal-on-scroll">

          <p className="font-label text-[8.5px] tracking-[0.45em] uppercase text-[#A8874A] mb-4">Nearby Landmarks</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-[#44564C]">
            {LANDMARKS.map((h, i) => (
              <a
                key={i}
                href={h.map}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative px-5 py-5 flex flex-col gap-2 hover:bg-[#01352A]/60 transition-all duration-300
                  ${i < LANDMARKS.length - 1 ? 'lg:border-r border-[#44564C]/60' : ''}
                  ${i < 4 && i % 2 === 0 ? 'sm:border-r border-[#44564C]/60' : ''}
                  ${i >= 1 ? 'border-t lg:border-t-0 border-[#44564C]/60' : ''}
                  ${i >= 2 ? 'sm:border-t sm:border-[#44564C]/60' : ''}
                `}
              >
                {/* Top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#A8874A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Category */}
                <p className="font-label text-[8px] tracking-[0.3em] uppercase text-[#8C968D] group-hover:text-[#A8874A]/70 transition-colors">
                  {h.category}
                </p>

                {/* Name */}
                <h4 className="font-heading text-[#EEE4DA] text-sm leading-snug flex-1">
                  {h.name}
                </h4>

                {/* Benefit text */}
                <p className="font-paragraph text-[11px] text-[#EEE4DA]/40 leading-relaxed">
                  {h.benefit}
                </p>

                {/* Distance + time — big and gold */}
                <div className="flex items-baseline gap-1.5 pt-3 border-t border-[#44564C]/50 mt-1">
                  <span className="font-heading text-[#A8874A]" style={{ fontSize: '1.2rem' }}>{h.dist}</span>
                  <span className="font-label text-[11px] text-[#EEE4DA]/50 font-medium">{h.time} away</span>
                </div>
              </a>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
