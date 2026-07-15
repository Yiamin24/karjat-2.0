'use client';

import React, { useState } from 'react';

const VIDEO_SRC = 'https://video.wixstatic.com/video/cef78c_6489c7c7d817487d8ae13c9390f40a0c/1080p/mp4/file.mp4';
const POSTER_SRC = '/Hero-poster.jpg';

export default function HeroSection({ onEnquireClick }: { onEnquireClick: () => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('https://hook.us1.make.com/39wm5das7y98hoh8h1lylvf9noffehm5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: new Date().toISOString(), ...formData }),
      });
    } catch { /* silent */ }
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 3000);
  };

  const inputClsDesktop =
    'w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-3.5 py-2.5 focus:outline-none focus:border-[#A8874A] focus:bg-white/15 transition-all duration-300 text-[13px] rounded-none';

  const inputClsMobile =
    'w-full bg-[#022921]/60 border border-[#44564C] text-[#EEE4DA] placeholder-[#8C968D] px-4 py-2.5 focus:outline-none focus:border-[#A8874A] focus:bg-[#022921]/80 transition-all duration-300 text-[13px]';

  /* ── Shared form markup ── */
  const renderForm = (inputCls: string) => (
    submitted ? (
      <div className="py-6 text-center">
        <div className="w-10 h-10 border-2 border-[#A8874A] rounded-full flex items-center justify-center mx-auto mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#A8874A" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-heading text-lg text-[#A8874A]">Thank You</p>
        <p className="text-white/50 text-xs mt-1">We&apos;ll reach out within 24 hours.</p>
      </div>
    ) : (
      <>
        <h3 className="font-heading text-white text-lg mb-0.5">Book a Site Visit</h3>
        <p className="text-white/40 text-[11px] mb-4">We&apos;ll get back within 24 hours</p>
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            required placeholder="Full Name" className={inputCls} />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
            required placeholder="+91 XXXXX XXXXX" className={inputCls} />
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            required placeholder="Email Address" className={inputCls} />
          <textarea name="message" value={formData.message} onChange={handleChange}
            placeholder="Message (optional)" rows={2} className={`${inputCls} resize-none`} />
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-[#A8874A] text-[#022921] hover:bg-[#C9A96E] disabled:opacity-50 py-3 text-[11px] tracking-[0.2em] uppercase font-bold font-label transition-all duration-300">
            {isSubmitting ? 'Sending…' : 'Submit'}
          </button>
        </form>
      </>
    )
  );

  return (
    <section id="home">
      {/* ═══════════════════════════════════════════════════════════════
          FULL-SCREEN VIDEO HERO
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative h-[100dvh] overflow-hidden bg-black">
        {/* Video */}
        <video
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay loop muted playsInline disablePictureInPicture aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* ── DESKTOP LAYOUT (lg+): brand left + form right, both on video ── */}
        <div className="hidden lg:flex relative z-10 h-full items-center px-16">
          <div className="w-full max-w-[1280px] mx-auto grid grid-cols-[1fr_360px] gap-14 items-center">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#A8874A]" />
                <span className="font-label text-[#A8874A] tracking-[0.35em] uppercase text-[11px]"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  Rudram Realty · Karjat, Maharashtra
                </span>
              </div>
              <h1 className="font-heading text-white leading-[0.88] tracking-[-0.02em] mb-4"
                style={{ fontSize: 'clamp(4rem,7vw,7.5rem)', textShadow: '0 4px 40px rgba(0,0,0,0.7)' }}>
                Karjat<br />
                <span className="text-[#A8874A]">Blooms</span>
              </h1>
              <p className="font-label text-white/70 tracking-[0.3em] uppercase text-[11px] mb-7"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                Private Estate Living · Where Nature Meets Luxury
              </p>
              <div className="flex items-center gap-0 mb-7">
                {([['100+', 'Curated Plots'], ['90 km', 'From Mumbai'], ['65 km', 'From Pune']] as const).map(([val, label]) => (
                  <div key={label} className="pr-6 mr-6 border-r border-white/20 last:border-r-0 last:pr-0 last:mr-0">
                    <div className="font-heading text-[#A8874A] leading-none mb-0.5 text-[clamp(1.4rem,2.2vw,2.2rem)]"
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
                      {val}
                    </div>
                    <div className="font-label text-white/50 tracking-[0.2em] uppercase text-[9px]"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onEnquireClick}
                  className="font-label tracking-[0.25em] uppercase font-semibold px-7 py-3 bg-[#A8874A] text-[#022921] hover:bg-[#C9A96E] transition-all duration-300 text-[11px]">
                  Enquire Now
                </button>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-label tracking-[0.25em] uppercase font-medium px-7 py-3 border border-white/30 text-white hover:border-[#A8874A] hover:text-[#A8874A] transition-all duration-300 text-[11px] flex items-center gap-2 group"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                  Explore
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form — on video */}
            <div className="bg-black/50 backdrop-blur-lg border border-white/15 p-5 shadow-2xl">
              <div className="w-9 h-0.5 bg-[#A8874A] mb-4" />
              {renderForm(inputClsDesktop)}
            </div>
          </div>
        </div>

        {/* ── MOBILE / TABLET LAYOUT (<lg): only brand on video ── */}
        <div className="flex lg:hidden relative z-10 h-full flex-col justify-end pb-24 px-5 sm:px-8">
          {/* Extra overlay for mobile readability */}
          <div className="absolute inset-0 -z-10" style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.8) 100%)',
          }} />
          <div className="w-full max-w-[600px]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-px bg-[#A8874A]" />
              <span className="font-label text-[#A8874A] tracking-[0.3em] uppercase text-[10px]"
                style={{ textShadow: '0 2px 6px rgba(0,0,0,1)' }}>
                Rudram Realty · Karjat
              </span>
            </div>
            <h1 className="font-heading text-white leading-[0.9] tracking-[-0.02em] mb-3"
              style={{ fontSize: 'clamp(2.5rem,12vw,4.5rem)', textShadow: '0 3px 20px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,1)' }}>
              Karjat<br />
              <span className="text-[#A8874A]">Blooms</span>
            </h1>
            <p className="font-label text-white tracking-[0.25em] uppercase text-[10px] mb-5"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,1)' }}>
              Private Estate Living
            </p>
            <div className="flex items-center gap-0 mb-5">
              {([['100+', 'Plots'], ['90 km', 'Mumbai'], ['65 km', 'Pune']] as const).map(([val, label]) => (
                <div key={label} className="pr-4 mr-4 border-r border-white/30 last:border-r-0 last:pr-0 last:mr-0">
                  <div className="font-heading text-[#A8874A] leading-none mb-0.5 text-xl"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                    {val}
                  </div>
                  <div className="font-label text-white/70 tracking-[0.15em] uppercase text-[8px]"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,1)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <button onClick={onEnquireClick}
                className="font-label tracking-[0.2em] uppercase font-semibold px-5 py-2.5 bg-[#A8874A] text-[#022921] hover:bg-[#C9A96E] transition-all duration-300 text-[10px]">
                Enquire Now
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-label tracking-[0.2em] uppercase font-medium px-5 py-2.5 border border-white/40 text-white hover:border-[#A8874A] hover:text-[#A8874A] transition-all duration-300 text-[10px] flex items-center gap-2 group"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                Explore
                <svg className="w-3 h-3 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-50">
          <span className="font-label text-white/50 tracking-[0.4em] uppercase text-[8px]">Scroll</span>
          <div className="w-px h-5 bg-gradient-to-b from-[#A8874A] to-transparent animate-pulse" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE FORM — below video, hidden on desktop
      ═══════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden bg-[#022921] py-10 px-5 sm:px-8">
        <div className="max-w-[500px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px bg-[#A8874A]" />
            <span className="font-label text-[#A8874A] tracking-[0.3em] uppercase text-[10px]">Get Started</span>
          </div>
          <h2 className="font-heading text-[#EEE4DA] text-2xl mb-2">
            Book a <span className="text-[#A8874A]">Site Visit</span>
          </h2>
          <p className="font-paragraph text-[#EEE4DA]/50 text-sm leading-relaxed mb-6">
            Experience Karjat Blooms firsthand. We&apos;ll respond within 24 hours.
          </p>
          <div className="bg-[#01352A] border border-[#44564C] p-5 sm:p-6">
            {renderForm(inputClsMobile)}
          </div>
        </div>
      </div>
    </section>
  );
}
