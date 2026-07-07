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

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22s-8-5.686-8-12a8 8 0 0116 0c0 6.314-8 12-8 12z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 8l10 6 10-6" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const GoldDivider = () => (
  <div className="flex items-center gap-4 w-full">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
    <div className="rotate-45 w-1.5 h-1.5 border border-[#d4af37]/60" />
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
  </div>
);

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Location', href: '#location' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Master Plan', href: '#masterplan' },
  { label: 'Contact', href: '#contact' },
];

export default function ContactSection({ onContactClick }: { onContactClick: () => void }) {
  const r1 = useReveal(0), r2 = useReveal(200), r3 = useReveal(300);

  const contactItems = [
    { icon: <MapPinIcon />, title: 'Our Office', detail: 'Off No. 1225, Ajmera Sikova, LBS Marg, Ghatkopar West, Mumbai 400086' },
    { icon: <PhoneIcon />, title: 'Call Us', detail: '+91 80800 67067' },
    { icon: <MailIcon />, title: 'Email Us', detail: 'service@rudramrealty.com' },
  ];

  const socialLinks = [
    { href: 'https://www.instagram.com/rudramrealty/', label: 'Instagram', icon: <InstagramIcon /> },
    { href: 'https://www.facebook.com/profile.php?id=61559924965451', label: 'Facebook', icon: <FacebookIcon /> },
    { href: 'https://www.linkedin.com/company/rudram-realty-india/', label: 'LinkedIn', icon: <LinkedinIcon /> },
  ];

  return (
    <>
      {/* ── Contact Section ── */}
      <section id="contact" className="relative w-full bg-[#f5f1e8] overflow-hidden">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        {/* Faint bg image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://static.wixstatic.com/media/cef78c_bc58319c52dd43deaad8b604b2606378~mv2.png"
            alt="" aria-hidden="true" className="w-full h-full object-cover opacity-[0.04]" />
        </div>

        <div className="relative z-10 max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-24 md:py-36">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left */}
            <div className="space-y-10">
              <div ref={r1} className="reveal-on-scroll">
                <p className="font-paragraph text-[10px] tracking-[0.35em] uppercase text-[#1a5c3a]/60 mb-5">Enquire</p>
                <h2 className="font-heading text-5xl md:text-6xl xl:text-7xl text-[#1a2e1a] leading-tight mb-6">
                  Begin Your<br />
                  <em className="not-italic text-[#1a5c3a]">Legacy</em>
                </h2>
                <p className="font-paragraph text-base md:text-lg text-[#1a2e1a]/60 max-w-md leading-relaxed border-l-2 border-[#d4af37]/40 pl-5">
                  We invite you to experience Karjat Blooms firsthand. Schedule a private site visit or request our detailed estate brochure.
                </p>
              </div>

              <div ref={r2} className="reveal-on-scroll space-y-6">
                {contactItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-5 group cursor-pointer">
                    <div className="w-11 h-11 border border-[#1a5c3a]/20 flex items-center justify-center text-[#1a5c3a]/50 group-hover:bg-[#1a5c3a] group-hover:border-[#1a5c3a] group-hover:text-[#f5f1e8] transition-all duration-300 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-paragraph text-[10px] tracking-[0.2em] uppercase text-[#1a5c3a]/50 mb-1">{item.title}</p>
                      <p className="font-paragraph text-sm text-[#1a2e1a]/70 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA card */}
            <div ref={r3} className="reveal-on-scroll">
              <div className="relative bg-[#1a5c3a] p-10 md:p-12">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#d4af37]/50" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#d4af37]/50" />
                <div className="relative z-10">
                  <p className="font-paragraph text-[10px] tracking-[0.35em] uppercase text-[#d4af37] mb-4">Private Viewing</p>
                  <h3 className="font-heading text-3xl text-[#f5f1e8] mb-4 leading-tight">Schedule a Site Visit</h3>
                  <p className="font-paragraph text-sm text-[#f5f1e8]/60 leading-relaxed mb-8">
                    Experience the serenity of Karjat Blooms for yourself. Our estate hosts exclusive private viewings — by appointment only.
                  </p>
                  <div className="space-y-3 mb-8">
                    {['Complimentary site tour', 'Detailed project brochure', 'One-on-one consultation', 'Flexible scheduling'].map((pt, i) => (
                      <div key={i} className="flex items-center gap-3 text-[#f5f1e8]/70 font-paragraph text-sm">
                        <div className="w-1 h-1 bg-[#d4af37] rounded-full flex-shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={onContactClick}
                    className="w-full bg-[#d4af37] text-[#0d3320] hover:bg-[#f5f1e8] py-5 text-xs tracking-[0.25em] uppercase font-bold transition-all duration-500"
                  >
                    Request a Visit
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0d3320] border-t border-[#d4af37]/15">
        <div className="max-w-[120rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-12 md:py-16">
          {/* Top row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://static.wixstatic.com/media/cef78c_bec60a55156b45779b30a3287c15a165~mv2.png"
                alt="Rudram Realty" className="w-10 h-10 object-contain brightness-0 invert flex-shrink-0" />
              <div>
                <p className="font-heading text-base text-[#f5f1e8] tracking-[0.2em] uppercase">Rudram Realty</p>
                <p className="font-paragraph text-[9px] tracking-[0.35em] uppercase text-[#d4af37]/70">Crafting Legacy Estates</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-5 md:gap-8">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href}
                  onClick={(e) => { e.preventDefault(); document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="font-paragraph text-xs tracking-[0.15em] uppercase text-[#f5f1e8]/40 hover:text-[#d4af37] transition-colors duration-300">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <GoldDivider />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-8">
            <div className="flex items-center gap-4">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37]/60 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {['Privacy Policy', 'Terms', 'Disclaimer'].map((item) => (
                <a key={item} href="#" className="font-paragraph text-[10px] tracking-[0.15em] uppercase text-[#f5f1e8]/25 hover:text-[#d4af37]/60 transition-colors duration-300">{item}</a>
              ))}
            </div>
          </div>

          <p className="font-paragraph text-[10px] text-[#f5f1e8]/20 text-center mt-8 tracking-wide">
            &copy; {new Date().getFullYear()} Rudram Realty. All rights reserved. &middot; Karjat Blooms is a Rudram Realty project.
          </p>
        </div>
      </footer>
    </>
  );
}
