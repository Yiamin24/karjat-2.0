'use client';

import React, { useRef, useEffect } from 'react';

const RevealWrapper: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
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
  return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>;
};

const staticCards = [
  {
    image: 'https://static.wixstatic.com/media/cef78c_bc58319c52dd43deaad8b604b2606378~mv2.png',
    tag: 'Morning',
    title: 'Morning Serenity',
    desc: 'Wake to birdsong, not traffic. Your mornings at Karjat Blooms belong entirely to you — unhurried, still, and surrounded by the Sahyadri mist.',
  },
  {
    image: 'https://static.wixstatic.com/media/cef78c_4ab6e602267a4b2ab30b818d6f5231a5~mv2.png',
    tag: 'Nature',
    title: 'Nature Immersed',
    desc: 'From misty hillscapes to tranquil rivulets — nature is not your backdrop here, it is your neighbourhood. Live inside the landscape.',
  },
  {
    image: 'https://static.wixstatic.com/media/cef78c_0fb7f2db0c9c4ed6914ab88cb736da40~mv2.png',
    tag: 'Escape',
    title: 'The Weekend Retreat',
    desc: 'Ninety minutes from Mumbai transforms into a world apart. The perfect escape — not just on weekends, but every day you choose peace over pace.',
  },
];

const LifestyleCard: React.FC<{ item: typeof staticCards[0]; index: number }> = ({ item, index }) => {
  const isEven = index % 2 === 0;
  return (
    <RevealWrapper delay={index * 80}>
      <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
        {/* Image */}
        <div className={`relative group ${!isEven ? 'lg:col-start-2' : ''}`}>
          <div className={`absolute w-full h-full bg-[#1a5c3a]/8 border border-[#1a5c3a]/15 z-0 ${isEven ? '-bottom-4 -right-4' : '-top-4 -left-4'}`} />
          <div className="relative z-10 aspect-[4/3] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a]/20 via-transparent to-transparent" />
          </div>
          <div className={`absolute top-6 z-20 ${isEven ? '-right-4 sm:-right-6' : '-left-4 sm:-left-6'}`}>
            <div className="bg-[#1a5c3a] px-4 py-2">
              <span className="font-paragraph text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">{item.tag}</span>
            </div>
          </div>
        </div>
        {/* Text */}
        <div className={`${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-heading text-5xl text-[#1a5c3a]/10 leading-none select-none">{String(index + 1).padStart(2, '0')}</span>
            <div className="h-px flex-1 bg-[#1a5c3a]/15" />
          </div>
          <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#1a2e1a] leading-tight mb-6">{item.title}</h3>
          <p className="font-paragraph text-base md:text-lg text-[#1a2e1a]/60 leading-relaxed mb-8 border-l-2 border-[#d4af37]/40 pl-5">{item.desc}</p>
          <div className="h-px w-12 bg-[#d4af37]" />
        </div>
      </div>
    </RevealWrapper>
  );
};

export default function LifestyleSection() {
  return (
    <section id="lifestyle" className="relative w-full bg-[#f5f1e8] overflow-hidden">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      <div className="max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-24 md:py-36">
        <RevealWrapper className="flex items-baseline gap-5 mb-16">
          <span className="font-heading leading-none select-none flex-shrink-0"
            style={{ fontSize: '5rem', color: 'transparent', WebkitTextStroke: '1px #1a5c3a', opacity: 0.15, lineHeight: 1 }}>05</span>
          <div>
            <p className="font-paragraph text-[10px] tracking-[0.35em] uppercase text-[#1a5c3a]/60 mb-2">The Lifestyle</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#1a2e1a] leading-tight">
              Life at<br /><em className="not-italic text-[#1a5c3a]">Karjat Blooms</em>
            </h2>
          </div>
        </RevealWrapper>
        <div className="space-y-20 md:space-y-32">
          {staticCards.map((card, i) => <LifestyleCard key={card.tag} item={card} index={i} />)}
        </div>
      </div>
    </section>
  );
}
