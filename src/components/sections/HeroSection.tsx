'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const VIDEO_SRC      = '/hero-scrub-trimmed.mp4';
const SECTION_HEIGHT = 550; // vh

export default function HeroSection({ onEnquireClick }: { onEnquireClick: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  const rawProg    = useRef(0);
  const smoothProg = useRef(0);
  const velocity   = useRef(0);
  const duration   = useRef(0);
  const seekable   = useRef(false);
  const isSeeking  = useRef(false);
  const lastSeekT  = useRef(-1);
  const isMobile   = useRef(false);
  const rafId      = useRef<number>(0);
  const lastTime   = useRef<number>(0);

  /* ─── VIDEO SETUP ─────────────────────────────────────── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    isMobile.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    vid.muted       = true;
    vid.playsInline = true;
    vid.preload     = isMobile.current ? 'metadata' : 'auto';

    const grabDuration = () => {
      if (vid.duration && isFinite(vid.duration)) duration.current = vid.duration;
    };

    const checkSeekable = () => {
      if (!seekable.current && vid.seekable.length > 0) {
        seekable.current = true;
        grabDuration();
        if (isMobile.current) {
          vid.play().then(() => { vid.pause(); vid.currentTime = 0; }).catch(() => {});
        }
      }
    };

    vid.addEventListener('progress',       () => checkSeekable());
    vid.addEventListener('loadedmetadata', () => { grabDuration(); checkSeekable(); }, { once: true });
    vid.addEventListener('loadeddata',     () => { grabDuration(); checkSeekable(); }, { once: true });
    vid.addEventListener('canplay',        () => checkSeekable());
    vid.addEventListener('canplaythrough', () => checkSeekable());
    vid.addEventListener('durationchange', () => { grabDuration(); checkSeekable(); });
    vid.addEventListener('stalled',        () => { isSeeking.current = false; });
    vid.addEventListener('seeking',        () => { isSeeking.current = true; });
    vid.addEventListener('seeked',         () => { isSeeking.current = false; });

    vid.load();
  }, []);

  /* ─── SCROLL + RAF ────────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    const vid     = videoRef.current;
    if (!section || !vid) return;

    const onScroll = () => {
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      const total    = section.offsetHeight - window.innerHeight;
      const next     = Math.min(1, Math.max(0, scrolled / total));
      if (Math.sign(next - rawProg.current) !== Math.sign(velocity.current)) velocity.current *= 0.3;
      rawProg.current = next;
    };

    const tick = (timestamp: number) => {
      const dt        = lastTime.current ? Math.min((timestamp - lastTime.current) / 1000, 0.064) : 0.016;
      lastTime.current = timestamp;

      const stiffness = 55;
      const damping   = 18;
      const mass      = isMobile.current ? 0.8 : 2.2;

      const spring      = -stiffness * (smoothProg.current - rawProg.current);
      const damp        = -damping * velocity.current;
      const accel       = (spring + damp) / mass;

      velocity.current   += accel * dt;
      smoothProg.current += velocity.current * dt;
      smoothProg.current  = Math.min(1, Math.max(0, smoothProg.current));

      if (Math.abs(velocity.current) < 0.00005 && Math.abs(smoothProg.current - rawProg.current) < 0.00005) {
        velocity.current   = 0;
        smoothProg.current = rawProg.current;
      }

      if (seekable.current && duration.current > 0) {
        const maxTime    = duration.current - (1 / 30);
        const targetTime = Math.max(0, Math.min(smoothProg.current * duration.current, maxTime));
        const minDelta   = isMobile.current ? 0.04 : 0.001;
        if (!isSeeking.current && Math.abs(targetTime - lastSeekT.current) >= minDelta) {
          lastSeekT.current = targetTime;
          vid.currentTime   = targetTime;
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{ height: `${SECTION_HEIGHT}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#022921]">

        {/* ── VIDEO — brightness + contrast boost for premium feel ── */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(1.08) contrast(1.08) saturate(1.15)' }}
        />

        {/* ── CINEMATIC OVERLAY — light vignette, not a blackout ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          {/* Bottom-heavy gradient so lower content stays readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          {/* Left edge shadow for left-aligned text scenes */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
          {/* Subtle top edge */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        </div>

        {/* ── HERO TEXT — each scene has own layout ── */}
        <HeroText smoothProg={smoothProg} onEnquireClick={onEnquireClick} />

        {/* ── SCROLL HINT ── */}
        <ScrollHint smoothProg={smoothProg} />

        {/* ── PROGRESS BAR ── */}
        <ProgressBar smoothProg={smoothProg} />

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO TEXT — three spatially distinct scenes, all RAF-driven
   Zero React re-renders during scroll.
══════════════════════════════════════════════════════════════ */
function HeroText({
  smoothProg,
  onEnquireClick,
}: {
  smoothProg: React.MutableRefObject<number>;
  onEnquireClick: () => void;
}) {
  const s1Ref    = useRef<HTMLDivElement>(null);
  const s2Ref    = useRef<HTMLDivElement>(null);
  const s3Ref    = useRef<HTMLDivElement>(null);
  const rafId    = useRef<number>();

  useEffect(() => {
    const tick = () => {
      const p = smoothProg.current;

      /* ── Scene 1: BRAND REVEAL — left-aligned, 0.00–0.35 ── */
      if (s1Ref.current) {
        const op = fadeInOut(p, 0, 0.08, 0.26, 0.35);
        const x  = slideInX(p, 0, 0.08); // slides in from left
        s1Ref.current.style.opacity   = String(op);
        s1Ref.current.style.transform = `translateX(${x}px)`;
      }

      /* ── Scene 2: TAGLINE — right-aligned, 0.33–0.66 ── */
      if (s2Ref.current) {
        const op = fadeInOut(p, 0.33, 0.43, 0.56, 0.66);
        const y  = slideIn(p, 0.33, 0.43);
        s2Ref.current.style.opacity   = String(op);
        s2Ref.current.style.transform = `translateY(${y}px)`;
      }

      /* ── Scene 3: CTA — centered split, 0.64–end ── */
      if (s3Ref.current) {
        const op = fadeInOut(p, 0.64, 0.76, 0.98, 1.00);
        const y  = slideIn(p, 0.64, 0.76);
        s3Ref.current.style.opacity   = String(op);
        s3Ref.current.style.transform = `translateY(${y}px)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [smoothProg]);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>

      {/* ══════════════════════════════════════════
          SCENE 1 — LEFT-ALIGNED BRAND REVEAL
          Large title flush left with a gold rule
          Creates an editorial, architectural feel
      ══════════════════════════════════════════ */}
      <div
        ref={s1Ref}
        className="absolute inset-0 flex flex-col justify-end pb-[12vh] px-8 sm:px-14 lg:px-20"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        {/* Gold rule + eyebrow */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-px bg-[#A8874A]" />
          <span
            className="font-label text-[#A8874A] tracking-[0.4em] uppercase"
            style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
          >
            Rudram Realty · Karjat, Maharashtra
          </span>
        </div>

        {/* Main title — massive, tight leading */}
        <h1
          className="font-heading text-white leading-[0.88] tracking-[-0.02em] max-w-[90vw] lg:max-w-[65vw]"
          style={{
            fontSize: 'clamp(3.8rem, 10vw, 10rem)',
            textShadow: '0 4px 40px rgba(0,0,0,0.5)',
          }}
        >
          Karjat
          <br />
          <span
            className="font-heading"
            style={{ color: '#A8874A' }}
          >
            Blooms
          </span>
        </h1>

        {/* Bottom descriptor */}
        <div className="mt-8 flex items-center gap-6">
          <div className="h-px w-16 bg-white/20" />
          <span
            className="font-label text-white/50 tracking-[0.35em] uppercase"
            style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.65rem)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
          >
            Private Estate Living
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SCENE 2 — RIGHT-ALIGNED TAGLINE
          With a vertical gold bar on the left side
          Creates visual tension + luxury editorial
      ══════════════════════════════════════════ */}
      <div
        ref={s2Ref}
        className="absolute inset-0 flex flex-col justify-center items-end pr-8 sm:pr-14 lg:pr-20"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        <div className="flex items-stretch gap-7 max-w-[700px]">
          {/* Vertical gold bar */}
          <div className="w-px self-stretch bg-gradient-to-b from-transparent via-[#A8874A] to-transparent flex-shrink-0" />

          <div className="text-right">
            <p
              className="font-label text-[#A8874A] tracking-[0.45em] uppercase mb-5"
              style={{ fontSize: 'clamp(0.55rem, 0.85vw, 0.68rem)', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
            >
              The Philosophy
            </p>
            <p
              className="font-heading text-white font-light leading-[1.1] tracking-[-0.01em]"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 4.8rem)',
                textShadow: '0 3px 24px rgba(0,0,0,0.6)',
              }}
            >
              Where pristine
              <br />
              wilderness meets
              <br />
              <span style={{ color: '#A8874A' }}>curated luxury.</span>
            </p>
            <div className="mt-8 flex justify-end">
              <div className="h-px w-20 bg-[#A8874A]/60" />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SCENE 3 — BOTTOM SPLIT: STATS + CTA
          Stats row on left, action on right
          Feels like a high-end brochure spread
      ══════════════════════════════════════════ */}
      <div
        ref={s3Ref}
        className="absolute inset-0 flex flex-col justify-end pb-[8vh] px-8 sm:px-14 lg:px-20"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        {/* Top label */}
        <p
          className="font-label text-[#A8874A] tracking-[0.5em] uppercase mb-8"
          style={{ fontSize: 'clamp(0.55rem, 0.85vw, 0.68rem)', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          A Private Sanctuary · Est. Karjat
        </p>

        {/* Headline */}
        <h2
          className="font-heading text-white leading-[0.9] tracking-[-0.02em] mb-10"
          style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 7rem)',
            textShadow: '0 4px 32px rgba(0,0,0,0.6)',
          }}
        >
          Begin Your
          <br />
          <span style={{ color: '#A8874A' }}>Legacy.</span>
        </h2>

        {/* Bottom row: stats + CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 sm:gap-0">

          {/* Stats */}
          <div className="flex items-stretch gap-0">
            {([
              ['100+', 'Curated Plots'],
              ['90 km', 'From Mumbai'],
              ['65 km', 'From Pune'],
            ] as const).map(([val, label], i) => (
              <div
                key={label}
                className="pr-8 sm:pr-12 mr-8 sm:mr-12 border-r border-white/15 last:border-r-0 last:pr-0 last:mr-0"
              >
                <div
                  className="font-heading leading-none mb-1"
                  style={{
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.4rem)',
                    color: '#A8874A',
                    textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                  }}
                >
                  {val}
                </div>
                <div
                  className="font-label text-white/55 tracking-[0.28em] uppercase"
                  style={{ fontSize: 'clamp(0.5rem, 0.75vw, 0.6rem)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={onEnquireClick}
              className="font-label tracking-[0.28em] uppercase font-semibold transition-all duration-400 px-8 py-3.5 bg-[#A8874A] text-[#022921] hover:bg-[#BF9A5A]"
              style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.7rem)' }}
            >
              Enquire Now
            </button>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-label tracking-[0.28em] uppercase font-medium transition-all duration-300 px-8 py-3.5 border border-white/30 text-white/80 hover:border-[#A8874A] hover:text-[#A8874A] flex items-center gap-3 group"
              style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.7rem)', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            >
              Discover Estate
              <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-6 inline-block" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

/* ── SCROLL HINT ── */
function ScrollHint({ smoothProg }: { smoothProg: React.MutableRefObject<number> }) {
  const ref   = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>();

  useEffect(() => {
    const tick = () => {
      if (ref.current) ref.current.style.opacity = String(Math.max(0, 1 - smoothProg.current / 0.05));
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [smoothProg]);

  return (
    <div
      ref={ref}
      className="absolute bottom-10 left-8 sm:left-14 lg:left-20 flex items-center gap-4 pointer-events-none"
      style={{ zIndex: 10, willChange: 'opacity' }}
    >
      <motion.div
        animate={{ scaleY: [1, 1.6, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originY: 'top' }}
        className="w-px h-10 bg-gradient-to-b from-[#A8874A] to-transparent"
      />
      <span
        className="font-label text-white/35 tracking-[0.5em] uppercase"
        style={{ fontSize: '0.55rem' }}
      >
        Scroll to explore
      </span>
    </div>
  );
}

/* ── PROGRESS BAR ── */
function ProgressBar({ smoothProg }: { smoothProg: React.MutableRefObject<number> }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const rafId   = useRef<number>();

  useEffect(() => {
    const tick = () => {
      if (fillRef.current) fillRef.current.style.width = `${smoothProg.current * 100}%`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [smoothProg]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8" style={{ zIndex: 10 }}>
      <div ref={fillRef} className="h-full bg-[#A8874A]" style={{ width: '0%' }} />
    </div>
  );
}

/* ── Pure math helpers ── */
const clamp = (v: number) => Math.min(1, Math.max(0, v));

const fadeInOut = (p: number, inS: number, inE: number, outS: number, outE: number) => {
  if (p <= inS)  return 0;
  if (p <= inE)  return clamp((p - inS) / (inE - inS));
  if (p <= outS) return 1;
  if (p <= outE) return clamp(1 - (p - outS) / (outE - outS));
  return 0;
};

const slideIn = (p: number, inS: number, inE: number, dist = 28) => {
  if (p <= inS) return dist;
  if (p >= inE) return 0;
  return dist * (1 - (p - inS) / (inE - inS));
};

// Slides in from left (negative X = comes from left)
const slideInX = (p: number, inS: number, inE: number, dist = -40) => {
  if (p <= inS) return dist;
  if (p >= inE) return 0;
  return dist * (1 - (p - inS) / (inE - inS));
};
