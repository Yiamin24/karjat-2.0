'use client';

import { useEffect, useRef, useState } from 'react';

const IS_DEV        = process.env.NODE_ENV === 'development';
const BASE_URL      = 'https://github.com/Yiamin24/karjat-2.0/releases/download/v1.0.0';
const VIDEO_DESKTOP = IS_DEV ? '/Hero-scrub.mp4'        : `${BASE_URL}/Hero-scrub.mp4`;
const VIDEO_MOBILE  = IS_DEV ? '/Hero-scrub-mobile.mp4' : `${BASE_URL}/Hero-scrub-mobile.mp4`;
const POSTER_SRC    = IS_DEV ? '/Hero-poster.jpg'       : `${BASE_URL}/Hero-poster.jpg`;

const SECTION_HEIGHT_DESKTOP = 500; // vh
const SECTION_HEIGHT_MOBILE  = 280; // vh

export default function HeroSection({ onEnquireClick }: { onEnquireClick: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const blobUrlRef = useRef<string | null>(null); // track blob URL for cleanup

  // scrub state — all refs, zero re-renders in hot loop
  const targetRef = useRef(0);  // raw scroll progress 0→1, written by scroll listener only
  const curRef    = useRef(0);  // lerped video progress, written by rAF only
  const displayP  = useRef(0);  // separate slower lerp for text scenes
  const rafRef    = useRef(0);

  // layout state
  const isMobileRef   = useRef(false);
  const layoutWidthRef = useRef(0);
  const reducedMotion = useRef(false);

  // poster visibility — the ONE state that needs a render
  const [posterVisible, setPosterVisible] = useState(true);

  // text refs
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const philoRef   = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const hintRef    = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);

  /* ── INIT: mobile detect, reduced-motion, blob load ─── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // — Layout calc — defined inside effect so it always closes over live refs —
    const recalcLayout = () => {
      if (!sectionRef.current) return;
      const h = isMobileRef.current ? SECTION_HEIGHT_MOBILE : SECTION_HEIGHT_DESKTOP;
      sectionRef.current.style.height = `${h}vh`;
    };

    // — Mobile detection via pointer capability (more reliable than UA sniff) —
    isMobileRef.current =
      window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      window.innerWidth <= 860;
    layoutWidthRef.current = window.innerWidth;

    // — prefers-reduced-motion —
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Apply initial section height
    recalcLayout();

    // If reduced motion: skip video entirely, keep poster, skip blob fetch
    if (reducedMotion.current) return;

    // — setAttribute for iOS attribute-level requirements —
    vid.setAttribute('playsinline', '');
    vid.setAttribute('muted', '');
    vid.muted       = true;
    vid.playsInline = true;
    vid.preload     = 'auto';

    const videoUrl = isMobileRef.current ? VIDEO_MOBILE : VIDEO_DESKTOP;

    // — BLOB LOAD: guarantees full seekable range on any host —
    // Plain src= on a static/dev server can return seekable=[0,0], freezing scrub at frame 0.
    fetch(videoUrl)
      .then(r => {
        if (!r.ok) throw new Error(`fetch ${r.status}`);
        return r.blob();
      })
      .then(blob => {
        if (!videoRef.current) return;
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        videoRef.current.src = url;
        videoRef.current.load();
      })
      .catch(() => {
        // Fallback to plain URL if fetch fails (e.g. CORS in dev)
        if (!videoRef.current) return;
        videoRef.current.src = videoUrl;
        videoRef.current.load();
      });

    // — Poster: hide only after the first real frame is decoded —
    // 'loadedmetadata' fires before any frame on iOS — 'seeked' is the safe gate.
    vid.addEventListener('seeked', () => setPosterVisible(false), { once: true });

    // — iOS prime: on first user touch/pointer, play→pause to unlock decoder —
    // Without this, the first seek after page load shows a black frame on iOS Safari.
    const primeVideo = () => {
      if (!isMobileRef.current || !videoRef.current) return;
      const v = videoRef.current;
      const p = v.play();
      if (p?.then) {
        p.then(() => {
          try { v.pause(); } catch (_) {}
        }).catch(() => {});
      }
    };
    window.addEventListener('pointerdown', primeVideo, { once: true, passive: true });
    window.addEventListener('touchstart',  primeVideo, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', primeVideo);
      window.removeEventListener('touchstart',  primeVideo);
      // Revoke blob URL to free memory
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  /* ── RESIZE: width-only guard ────────────────────────── */
  useEffect(() => {
    const recalcLayout = () => {
      if (!sectionRef.current) return;
      const h = isMobileRef.current ? SECTION_HEIGHT_MOBILE : SECTION_HEIGHT_DESKTOP;
      sectionRef.current.style.height = `${h}vh`;
    };

    const onResize = () => {
      // On mobile, the browser fires resize on every URL-bar slide-in/out (height-only change).
      // Re-running layout on those would jump scroll position — ignore them.
      if (isMobileRef.current && window.innerWidth === layoutWidthRef.current) return;
      layoutWidthRef.current = window.innerWidth;
      recalcLayout();
    };

    window.addEventListener('resize',            onResize);
    window.addEventListener('orientationchange', recalcLayout);
    return () => {
      window.removeEventListener('resize',            onResize);
      window.removeEventListener('orientationchange', recalcLayout);
    };
  }, []);

  /* ── SCROLL LISTENER → targetRef (read only) ─────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const getProgress = () => {
      const rect   = section.getBoundingClientRect();
      const total  = rect.height - window.innerHeight; // total scrollable distance
      const scrolled = -rect.top;                       // how far we've scrolled in
      return Math.min(1, Math.max(0, scrolled / total));
    };

    // scroll event: only writes targetRef, never touches video
    const onScroll = () => { targetRef.current = getProgress(); };
    // touchmove fires synchronously during gesture — supplements coalesced scroll on iOS
    const onTouch  = () => { targetRef.current = getProgress(); };

    window.addEventListener('scroll',    onScroll, { passive: true });
    window.addEventListener('touchmove', onTouch,  { passive: true });
    onScroll(); // seed

    return () => {
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  /* ── MASTER rAF: lerp → seek + text + UI ─────────────── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // lerp factor: 1 = instant (for reduced-motion), 0.18 = smooth easing
    const lerpFactor = reducedMotion.current ? 1 : 0.18;

    const raf = () => {
      // — Video scrub —
      if (vid.duration && isFinite(vid.duration)) {
        if (!vid.seeking) {
          // Lerp curRef toward targetRef. When vid.seeking was true we skipped writes
          // but curRef kept lerping, so we snap to the freshest target the moment decoder is free.
          curRef.current += (targetRef.current - curRef.current) * lerpFactor;
          const t   = Math.min(curRef.current, 0.999) * vid.duration;
          // Coarser eps on mobile = fewer decoder invocations = no freeze on fast scroll
          const eps = isMobileRef.current ? 0.02 : 0.008;
          if (Math.abs(vid.currentTime - t) > eps) {
            try { vid.currentTime = t; } catch (_) {/* swallow DOMException on rapid seeks */}
          }
        }
        // When seeking=true: do nothing to the video this frame.
        // curRef keeps lerping so it's already at the right target when decoder becomes free.
      }

      // — Text scenes: separate slower lerp, unaffected by seeking guard —
      displayP.current += (targetRef.current - displayP.current) * 0.09;
      const p = displayP.current;

      /*
        Scene map (p = 0→1):
        S1 Brand      enter 0.00→0.10  hold→0.30  exit 0.30→0.42
        S2 Philosophy enter 0.34→0.47  hold→0.60  exit 0.60→0.72
        S3 Legacy+CTA enter 0.66→0.78  hold→1.00
      */
      const s1  = scene(p, 0, 0.10, 0.30, 0.42);
      const ex1 = exitT(p, 0.30, 0.42);
      set(eyebrowRef, s1, `translateX(${-ex1 * 40}px)`);
      set(titleRef,   s1, `translate(${-ex1 * 55}px, ${enterT(p, 0, 0.10) * 18}px)`);
      set(subRef, scene(p, 0.04, 0.13, 0.30, 0.42), `translateX(${-ex1 * 28}px)`);

      const s2 = scene(p, 0.34, 0.47, 0.60, 0.72);
      set(philoRef, s2, `translateX(${enterT(p, 0.34, 0.47) * 50 + exitT(p, 0.60, 0.72) * 60}px)`);

      const s3 = scene(p, 0.66, 0.78, 0.99, 1.00);
      set(statsRef, s3, `translateY(${enterT(p, 0.66, 0.78) * 32}px)`);
      set(ctaRef, scene(p, 0.72, 0.82, 0.99, 1.00), `translateY(${enterT(p, 0.72, 0.82) * 20}px)`);

      if (hintRef.current)
        hintRef.current.style.opacity = String(Math.max(0, 1 - targetRef.current / 0.08));
      if (barRef.current)
        barRef.current.style.transform = `scaleX(${targetRef.current})`;

      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{ height: `${SECTION_HEIGHT_DESKTOP}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#022921]">

        {/* POSTER — shown until first seeked event fires (iOS-safe reveal) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={POSTER_SRC}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ zIndex: posterVisible ? 2 : 0, opacity: posterVisible ? 1 : 0 }}
        />

        {/* VIDEO — src/blob set in useEffect; hidden by poster until first seeked */}
        <video
          ref={videoRef}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        />

        {/* OVERLAYS */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.55) 100%)'
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3,
          background: 'linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.08) 45%, transparent 100%)'
        }} />

        {/* S1 — BRAND */}
        <div className="absolute inset-0 flex flex-col justify-end pb-[13vh] px-8 sm:px-14 lg:px-20 pointer-events-none" style={{ zIndex: 5 }}>
          <div ref={eyebrowRef} style={{ opacity: 0, willChange: 'opacity,transform' }} className="flex items-center gap-4 mb-5">
            <div className="w-10 h-px bg-[#A8874A]" />
            <span className="font-label text-[#A8874A] tracking-[0.4em] uppercase"
              style={{ fontSize: 'clamp(0.55rem,0.9vw,0.7rem)', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
              Rudram Realty · Karjat, Maharashtra
            </span>
          </div>
          <div ref={titleRef} style={{ opacity: 0, willChange: 'opacity,transform' }}>
            <h1 className="font-heading text-white leading-[0.88] tracking-[-0.02em] max-w-[90vw] lg:max-w-[65vw]"
              style={{ fontSize: 'clamp(3.8rem,10vw,10rem)', textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
              Karjat<br /><span style={{ color: '#A8874A' }}>Blooms</span>
            </h1>
          </div>
          <div ref={subRef} style={{ opacity: 0, willChange: 'opacity,transform' }} className="mt-7 flex items-center gap-6">
            <div className="h-px w-16 bg-white/20" />
            <span className="font-label text-white/50 tracking-[0.35em] uppercase"
              style={{ fontSize: 'clamp(0.5rem,0.8vw,0.65rem)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
              Private Estate Living
            </span>
          </div>
        </div>

        {/* S2 — PHILOSOPHY */}
        <div className="absolute inset-0 flex flex-col justify-center items-end pr-8 sm:pr-14 lg:pr-20 pointer-events-none" style={{ zIndex: 5 }}>
          <div ref={philoRef} style={{ opacity: 0, willChange: 'opacity,transform' }} className="flex items-stretch gap-7 max-w-[680px]">
            <div className="absolute inset-0 -right-8 sm:-right-14 lg:-right-20 -left-6"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 80% 50%, rgba(0,0,0,0.45) 0%, transparent 100%)', zIndex: -1 }} />
            <div className="w-px self-stretch bg-gradient-to-b from-transparent via-[#A8874A] to-transparent flex-shrink-0" />
            <div className="text-right">
              <p className="font-label text-[#A8874A] tracking-[0.45em] uppercase mb-5"
                style={{ fontSize: 'clamp(0.55rem,0.85vw,0.68rem)', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
                The Philosophy
              </p>
              <p className="font-heading text-white font-light leading-[1.1] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(2rem,4.5vw,4.8rem)', textShadow: '0 2px 20px rgba(0,0,0,0.85), 0 4px 40px rgba(0,0,0,0.7)' }}>
                Where pristine<br />wilderness meets<br />
                <span style={{
                  color: '#C9A96E',
                  textShadow: '0 2px 12px rgba(0,0,0,1), 0 4px 32px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.8)',
                }}>curated luxury.</span>
              </p>
              <div className="mt-8 flex justify-end">
                <div className="h-px w-20 bg-[#A8874A]/60" />
              </div>
            </div>
          </div>
        </div>

        {/* S3 — LEGACY + CTA */}
        <div className="absolute inset-x-0 bottom-0 pb-[8vh] px-8 sm:px-14 lg:px-20" style={{ zIndex: 5 }}>
          <div ref={statsRef} style={{ opacity: 0, willChange: 'opacity,transform' }} className="pointer-events-none">
            <p className="font-label text-[#A8874A] tracking-[0.5em] uppercase mb-6"
              style={{ fontSize: 'clamp(0.55rem,0.85vw,0.68rem)', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
              A Private Sanctuary · Est. Karjat
            </p>
            <h2 className="font-heading text-white leading-[0.9] tracking-[-0.02em] mb-8"
              style={{ fontSize: 'clamp(2.6rem,6.5vw,7rem)', textShadow: '0 4px 32px rgba(0,0,0,0.6)' }}>
              Begin Your<br /><span style={{ color: '#A8874A' }}>Legacy.</span>
            </h2>
            <div className="flex items-stretch gap-0 mb-8">
              {([['100+','Curated Plots'],['90 km','From Mumbai'],['65 km','From Pune']] as const).map(([v,l]) => (
                <div key={l} className="pr-8 sm:pr-12 mr-8 sm:mr-12 border-r border-white/15 last:border-r-0 last:pr-0 last:mr-0">
                  <div className="font-heading leading-none mb-1"
                    style={{ fontSize:'clamp(1.5rem,2.5vw,2.4rem)',color:'#A8874A',textShadow:'0 2px 12px rgba(0,0,0,0.7)' }}>{v}</div>
                  <div className="font-label text-white/55 tracking-[0.28em] uppercase"
                    style={{ fontSize:'clamp(0.5rem,0.75vw,0.6rem)',textShadow:'0 1px 6px rgba(0,0,0,0.8)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div ref={ctaRef} style={{ opacity: 0, willChange: 'opacity,transform' }} className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={onEnquireClick}
              className="font-label tracking-[0.28em] uppercase font-semibold transition-all duration-300 px-8 py-3.5 bg-[#A8874A] text-[#022921] hover:bg-[#BF9A5A]"
              style={{ fontSize: 'clamp(0.6rem,0.85vw,0.7rem)' }}>
              Enquire Now
            </button>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-label tracking-[0.28em] uppercase font-medium transition-all duration-300 px-8 py-3.5 border border-white/30 text-white/80 hover:border-[#A8874A] hover:text-[#A8874A] flex items-center gap-3 group"
              style={{ fontSize: 'clamp(0.6rem,0.85vw,0.7rem)', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
              Discover Estate
              <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-6 inline-block" />
            </button>
          </div>
        </div>

        {/* SCROLL HINT */}
        <div
          ref={hintRef}
          className="absolute bottom-10 left-8 sm:left-14 lg:left-20 flex items-center gap-4 pointer-events-none"
          style={{ zIndex: 10, willChange: 'opacity' }}
        >
          <div className="w-px h-10 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-[#A8874A] to-transparent"
              style={{ animation: 'scrubPulse 2s ease-in-out infinite' }} />
          </div>
          <span className="font-label text-white/35 tracking-[0.5em] uppercase" style={{ fontSize: '0.55rem' }}>
            Scroll to explore
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" style={{ zIndex: 10 }}>
          <div ref={barRef} className="h-full bg-[#A8874A] origin-left"
            style={{ transform: 'scaleX(0)', willChange: 'transform' }} />
        </div>

      </div>
      <style>{`@keyframes scrubPulse{0%,100%{transform:scaleY(1);opacity:1}50%{transform:scaleY(1.5);opacity:.5}}`}</style>
    </section>
  );
}

/* ── math helpers ──────────────────────────────────────── */
const cl     = (v: number) => Math.min(1, Math.max(0, v));
const norm   = (p: number, s: number, e: number) => cl((p - s) / Math.max(0.001, e - s));
const eOut   = (t: number) => 1 - Math.pow(1 - t, 3);
const eIn    = (t: number) => t * t;
const scene  = (p: number, is: number, ie: number, os: number, oe: number) =>
  Math.min(eOut(norm(p, is, ie)), cl(1 - norm(p, os, oe)));
const enterT = (p: number, s: number, e: number) => 1 - eOut(norm(p, s, e));
const exitT  = (p: number, s: number, e: number) => eIn(norm(p, s, e));
const set    = (ref: React.RefObject<HTMLDivElement | null>, opacity: number, transform: string) => {
  if (!ref.current) return;
  ref.current.style.opacity   = String(opacity);
  ref.current.style.transform = transform;
};
