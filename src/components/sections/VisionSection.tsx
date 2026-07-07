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

const highlights = [
  { number: '01', title: 'Private & Exclusive', body: 'Limited plots ensuring absolute privacy and an unhurried pace of life away from city density.' },
  { number: '02', title: 'Ecological Harmony', body: 'Designed around the natural topography, preserving existing trees, streams, and biodiversity.' },
  { number: '03', title: 'Legacy Architecture', body: 'Villa designs guided by timeless principles — structures that gain beauty and character with time.' },
  { number: '04', title: 'Smart Infrastructure', body: '24/7 security, underground utilities, high-speed connectivity — invisible yet omnipresent.' },
];

export default function VisionSection() {
  const r1 = useReveal(0), r2 = useReveal(200), r3 = useReveal(350), r4 = useReveal(100);

  return (
    <section id="vision" className="relative w-full bg-[#f5f1e8] overflow-hidden">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      <div className="max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-24 md:py-36">

        <div ref={r1} className="reveal-on-scroll flex items-baseline gap-5 mb-16">
          <span className="font-heading leading-none select-none flex-shrink-0"
            style={{ fontSize: '5rem', color: 'transparent', WebkitTextStroke: '1px #1a5c3a', opacity: 0.15, lineHeight: 1 }}>03</span>
          <div>
            <p className="font-paragraph text-[10px] tracking-[0.35em] uppercase text-[#1a5c3a]/60 mb-2">The Vision</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#1a2e1a] leading-tight">
              Why <em className="not-italic text-[#1a5c3a]">Karjat Blooms</em>
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left image */}
          <div ref={r4} className="reveal-on-scroll lg:col-span-6 xl:col-span-5 relative order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -bottom-5 -left-5 w-full h-full border border-[#1a5c3a]/15 bg-[#1a5c3a]/5 z-0" />
              <div className="relative z-10 aspect-[3/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://static.wixstatic.com/media/cef78c_0fb7f2db0c9c4ed6914ab88cb736da40~mv2.png"
                  alt="Karjat Blooms — Natural landscape"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a]/40 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-8 left-0 right-0 px-8 z-20">
                <div className="bg-[#f5f1e8]/90 backdrop-blur-sm border-l-4 border-[#d4af37] px-6 py-5">
                  <p className="font-heading text-base md:text-lg text-[#1a2e1a] italic leading-snug">
                    &ldquo;A commitment to excellence, sustainability, and creating legacy estates.&rdquo;
                  </p>
                  <p className="font-paragraph text-[10px] tracking-[0.25em] uppercase text-[#1a5c3a] mt-3">— Rudram Realty</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 space-y-10">
            <div ref={r2} className="reveal-on-scroll">
              <p className="font-paragraph text-base md:text-lg text-[#1a2e1a]/65 leading-relaxed border-l-2 border-[#1a5c3a]/25 pl-6 mb-8">
                We believe that the finest residences are those in harmony with their surroundings. Karjat Blooms was conceived as a living statement — a place where the architecture defers to nature, and where luxury is measured not in gilded surfaces, but in uninterrupted views, still mornings, and the freedom to build a life entirely on your own terms.
              </p>
            </div>
            <div ref={r3} className="reveal-on-scroll grid sm:grid-cols-2 gap-5">
              {highlights.map((h, i) => (
                <div key={i} className="group relative bg-white border border-[#1a5c3a]/10 p-6 hover:border-[#1a5c3a]/30 hover:shadow-md transition-all duration-500">
                  <div className="absolute top-0 right-0 w-0 h-0.5 bg-[#d4af37] group-hover:w-full transition-all duration-500" />
                  <span className="font-heading text-3xl text-[#1a5c3a]/10 leading-none block mb-3 select-none">{h.number}</span>
                  <h4 className="font-heading text-lg text-[#1a2e1a] mb-2">{h.title}</h4>
                  <p className="font-paragraph text-sm text-[#1a2e1a]/55 leading-relaxed">{h.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
