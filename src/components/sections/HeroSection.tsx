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
    'w-full bg-[#022921]/60 border border-[#44564C] text-[#EEE4DA] placeholder-[#8C968D] px-4 py-2.5 focus:outline-none focus:border-[#A8874A] focus:bg-[#022921]/80 transition-all duration-300 text-[13px]';

  return (
    <section id="home">
      {/* ═══════════════════════════════════════════════
          PART 1: Full-screen video with brand content
      ═══════════════════════════════════════════════ */}
      <div className="relative h-screen overflow-hidden bg-black">
        {/* Video */}
        <video
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay loop muted playsInline disablePictureInPicture aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Light overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* Brand content — centered vertically */}
        <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-10 lg:px-16">
          <div className="max-w-[1200px] mx-auto w-full">
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
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-50">
          <span className="font-label text-white/50 tracking-[0.4em] uppercase text-[8px]">Scroll</span>
          <div className="w-px h-5 bg-gradient-to-b from-[#A8874A] to-transparent animate-pulse" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PART 2: Form section — below the video
      ═══════════════════════════════════════════════ */}
      <div className="bg-[#022921] py-12 md:py-16 px-5 sm:px-10 lg:px-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-center">

          {/* Left — CTA text */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#A8874A]" />
              <span className="font-label text-[#A8874A] tracking-[0.35em] uppercase text-[10px]">
                Get Started
              </span>
            </div>
            <h2 className="font-heading text-[#EEE4DA] leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>
              Book a <span className="text-[#A8874A]">Site Visit</span>
            </h2>
            <p className="font-paragraph text-[#EEE4DA]/55 text-base leading-relaxed max-w-md">
              Experience Karjat Blooms firsthand. Schedule a private viewing and discover your future estate nestled in the Sahyadri foothills.
            </p>
          </div>

          {/* Right — Form */}
          <div className="bg-[#01352A] border border-[#44564C] p-6 md:p-8">
            {/* Corner accents */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-8 h-8 border-t-2 border-l-2 border-[#A8874A]/50 pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-8 h-8 border-b-2 border-r-2 border-[#A8874A]/50 pointer-events-none" />
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 border-2 border-[#A8874A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#A8874A" strokeWidth="2.5" strokeLinecap="round" className="w-6 h-6">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="font-heading text-xl text-[#A8874A]">Thank You</p>
                <p className="text-[#EEE4DA]/50 text-sm mt-1">We&apos;ll reach out within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-[#EEE4DA] text-xl mb-1">Get In Touch</h3>
                <p className="text-[#8C968D] text-[11px] mb-5">We&apos;ll get back within 24 hours</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    required placeholder="Full Name" className={inputCls} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    required placeholder="+91 XXXXX XXXXX" className={inputCls} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    required placeholder="Email Address" className={inputCls} />
                  <textarea name="message" value={formData.message} onChange={handleChange}
                    placeholder="Message (optional)" rows={3} className={`${inputCls} resize-none`} />
                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-[#A8874A] text-[#022921] hover:bg-[#BF9A5A] disabled:opacity-50 py-3.5 text-[11px] tracking-[0.2em] uppercase font-bold font-label transition-all duration-300 mt-1">
                    {isSubmitting ? 'Sending…' : 'Submit'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
