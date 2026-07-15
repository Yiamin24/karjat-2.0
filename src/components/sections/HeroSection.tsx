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

  const inputCls =
    'w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-3.5 py-2.5 focus:outline-none focus:border-[#A8874A] focus:bg-white/15 transition-all duration-300 text-[13px] rounded-none';

  return (
    <section id="home" className="relative h-screen overflow-hidden bg-black">
      {/* ── VIDEO BG ── */}
      <video
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay loop muted playsInline disablePictureInPicture aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── OVERLAY — light, lets video colors through while keeping text legible ── */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* ── CONTENT GRID ── */}
      <div className="relative z-10 h-full flex flex-col">

        {/* Top spacer — lets the video breathe at the top */}
        <div className="flex-[2]" />

        {/* Main content area */}
        <div className="flex-[3] flex items-start justify-center px-5 sm:px-10 lg:px-16">
          <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-end">

            {/* ━━ LEFT: Brand ━━ */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#A8874A]" />
                <span className="font-label text-[#A8874A] tracking-[0.35em] uppercase text-[11px]"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  Rudram Realty · Karjat, Maharashtra
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-white leading-[0.88] tracking-[-0.02em] mb-4"
                style={{ fontSize: 'clamp(3rem,7.5vw,7.5rem)', textShadow: '0 4px 40px rgba(0,0,0,0.7)' }}>
                Karjat<br />
                <span className="text-[#A8874A]">Blooms</span>
              </h1>

              {/* Subtitle */}
              <p className="font-label text-white/70 tracking-[0.3em] uppercase text-[11px] mb-7"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                Private Estate Living · Where Nature Meets Luxury
              </p>

              {/* Stats */}
              <div className="flex items-center gap-0 mb-7">
                {([['100+', 'Curated Plots'], ['90 km', 'From Mumbai'], ['65 km', 'From Pune']] as const).map(([val, label]) => (
                  <div key={label} className="pr-6 mr-6 border-r border-white/20 last:border-r-0 last:pr-0 last:mr-0">
                    <div className="font-heading text-[#A8874A] leading-none mb-0.5"
                      style={{ fontSize: 'clamp(1.4rem,2.2vw,2.2rem)', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
                      {val}
                    </div>
                    <div className="font-label text-white/50 tracking-[0.2em] uppercase text-[9px]"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 flex-wrap">
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

            {/* ━━ RIGHT: Form ━━ */}
            <div className="w-full">
              <div className="bg-black/50 backdrop-blur-lg border border-white/15 p-5 shadow-2xl">
                <div className="w-9 h-0.5 bg-[#A8874A] mb-4" />

                {submitted ? (
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
                        required placeholder="Email" className={inputCls} />
                      <textarea name="message" value={formData.message} onChange={handleChange}
                        placeholder="Message (optional)" rows={2} className={`${inputCls} resize-none`} />
                      <button type="submit" disabled={isSubmitting}
                        className="w-full bg-[#A8874A] text-[#022921] hover:bg-[#C9A96E] disabled:opacity-50 py-3 text-[11px] tracking-[0.2em] uppercase font-bold font-label transition-all duration-300">
                        {isSubmitting ? 'Sending…' : 'Submit'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom spacer + scroll hint */}
        <div className="flex-[0.5] flex items-end justify-center pb-5">
          <div className="flex flex-col items-center gap-1.5 opacity-50">
            <span className="font-label text-white/50 tracking-[0.4em] uppercase text-[8px]">Scroll</span>
            <div className="w-px h-5 bg-gradient-to-b from-[#A8874A] to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
