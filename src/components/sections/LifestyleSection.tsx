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

/* ── Data from CSV (sorted by Display Order) ── */
const LIFESTYLE = [
  {
    order: 1,
    headline: 'Serene Mornings',
    summary: 'Embrace tranquil mornings amidst nature\'s embrace.',
    desc: 'Wake up to the gentle symphony of nature, with panoramic views of lush greenery and the crisp, clean air of Karjat. A perfect start to a day of tranquility and rejuvenation, surrounded by the untouched beauty of your private estate.',
    image: '/Serene morning.png',
  },
  {
    order: 2,
    headline: 'Private Estate Living',
    summary: 'Unrivaled privacy in a luxurious natural setting.',
    desc: 'Experience unparalleled privacy and exclusivity within your sprawling estate. Each residence is a sanctuary, meticulously designed for discerning individuals who value solitude, space, and a profound connection with the natural world.',
    image: 'https://static.wixstatic.com/media/cef78c_91f85d19d5eb4e9db689bd4a7499c2e9~mv2.png',
  },
  {
    order: 3,
    headline: 'Eco-Conscious Luxury',
    summary: 'Sustainable opulence, harmonizing with nature.',
    desc: 'Karjat Blooms is a testament to sustainable living without compromising on opulence. Thoughtful design integrates seamlessly with the environment, utilizing natural resources and promoting a harmonious, eco-friendly existence.',
    image: 'https://static.wixstatic.com/media/cef78c_220aaf7659eb4f06929c1dd3e7eaf880~mv2.png',
  },
  {
    order: 4,
    headline: 'Bespoke Leisure',
    summary: 'Personalized leisure and refined well-being.',
    desc: 'Indulge in a lifestyle tailored to your desires. From meticulously curated private gardens to exclusive recreational spaces, every amenity is crafted to elevate your leisure, well-being, and provide moments of pure bliss.',
    image: 'https://static.wixstatic.com/media/cef78c_b54f190eb75d4280ad46d73a1d20610a~mv2.png',
  },
];

export default function LifestyleSection() {
  const headerRef = useReveal(0);

  return (
    <section id="lifestyle" className="relative w-full bg-[#022921] overflow-hidden">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#A8874A]/35 to-transparent" />

      <div className="max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-14 md:py-20">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="reveal-on-scroll mb-10">
          <div className="flex items-baseline gap-5 mb-6">
            <span className="font-heading leading-none select-none flex-shrink-0"
              style={{ fontSize: '5rem', color: 'transparent', WebkitTextStroke: '1px #01352A', opacity: 0.4, lineHeight: 1 }}>
              05
            </span>
            <div>
              <p className="font-label text-[10px] tracking-[0.4em] uppercase text-[#8C968D] mb-2">
                The Lifestyle
              </p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#EEE4DA] leading-tight">
                Life at<br />
                <em className="not-italic text-[#A8874A]">Karjat Blooms</em>
              </h2>
            </div>
          </div>
          <p className="font-paragraph text-base md:text-lg text-[#EEE4DA]/55 leading-relaxed max-w-2xl border-l-2 border-[#A8874A]/40 pl-5">
            Beyond a residence — a way of life. Every detail of Karjat Blooms is calibrated to deliver an existence of meaning, stillness, and understated elegance.
          </p>
        </div>

        {/* ── CARDS: alternating layout ── */}
        <div className="space-y-14 md:space-y-20">
          {LIFESTYLE.map((item, i) => {
            const isEven = i % 2 === 0;
            const cardRef = useReveal(i * 60); // eslint-disable-line react-hooks/rules-of-hooks
            return (
              <div
                key={item.order}
                ref={cardRef}
                className="reveal-on-scroll grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"
              >
                {/* Image */}
                <div className={`relative group ${!isEven ? 'lg:order-2' : ''}`}>
                  {/* Shadow offset block */}
                  <div className={`absolute w-full h-full border border-[#44564C] bg-[#01352A]/40 z-0 ${
                    isEven ? '-bottom-4 -right-4 sm:-bottom-6 sm:-right-6' : '-top-4 -left-4 sm:-top-6 sm:-left-6'
                  }`} />
                  <div className="relative z-10 aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#022921]/25 via-transparent to-transparent" />
                  </div>
                  {/* Tag */}
                  <div className={`absolute top-6 z-20 ${isEven ? '-right-4 sm:-right-5' : '-left-4 sm:-left-5'}`}>
                    <div className="bg-[#01352A] px-4 py-2 border border-[#44564C]">
                      <span className="font-label text-[9px] tracking-[0.3em] uppercase text-[#A8874A]">
                        {String(item.order).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-heading text-6xl text-[#01352A] leading-none select-none">
                      {String(item.order).padStart(2, '0')}
                    </span>
                    <div className="h-px flex-1 bg-[#44564C]" />
                  </div>

                  <p className="font-label text-[9px] tracking-[0.4em] uppercase text-[#8C968D] mb-3">
                    {item.summary}
                  </p>

                  <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#EEE4DA] leading-tight mb-6">
                    {item.headline}
                  </h3>

                  <p className="font-paragraph text-base md:text-lg text-[#EEE4DA]/60 leading-relaxed mb-8 border-l-2 border-[#A8874A]/40 pl-5">
                    {item.desc}
                  </p>

                  <div className="h-px w-12 bg-[#A8874A]" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
