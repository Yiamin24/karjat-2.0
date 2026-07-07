'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import { useLenis } from '@/components/SmoothScroll';

const VIDEO_URL  = 'https://video.wixstatic.com/video/cef78c_f466b469495745e99e5e9548ee4a1b41/1080p/mp4/file.mp4';
const POSTER_URL = 'https://static.wixstatic.com/media/cef78c_bc58319c52dd43deaad8b604b2606378~mv2.png';

/* Hero animation completes at this scroll progress value */
const HERO_DONE = 0.95;

export default function HeroSection({ onEnquireClick }: { onEnquireClick: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const { lenis }    = useLenis();

  /* ── Video ready state ─────────────────────── */
  const [videoReady, setVideoReady] = useState(false);
  const videoDuration = useRef<number>(0);

  /* ── Hero complete — unlocks the page ──────── */
  const [heroComplete, setHeroComplete] = useState(false);

  /* ── Scroll lock overlay visibility ─────────
     Visible until hero is done, then fades out   */
  const [lockVisible, setLockVisible] = useState(true);

  /* ── Scroll tracking on the 500vh container ─ */
  const { scrollYProgress } = useScroll({ target: containerRef });

  /* Spring gives the heavy, weighted scrub feel */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping:   25,
    restDelta: 0.0001,
  });

  /* ─────────────────────────────────────────────
     VIDEO SETUP
     We need loadedmetadata before we can set
     currentTime. Preload the first frame on mount.
  ───────────────────────────────────────────── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted       = true;
    vid.playsInline = true;
    vid.preload     = 'auto';

    const onMeta = () => {
      videoDuration.current = vid.duration;
      vid.currentTime = 0;   // force first frame to render (removes black)
      setVideoReady(true);
    };

    if (vid.readyState >= 1) {
      // already loaded (e.g. hot-reload)
      onMeta();
    } else {
      vid.addEventListener('loadedmetadata', onMeta, { once: true });
    }

    // Kick off buffering
    vid.load();

    return () => {
      vid.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  /* ─────────────────────────────────────────────
     VIDEO SCRUB
     Drive currentTime from smoothProgress.
     Guard: only write when video is ready.
  ───────────────────────────────────────────── */
  useMotionValueEvent(smoothProgress, 'change', (p) => {
    const vid = videoRef.current;
    if (!vid || !videoReady) return;
    const dur = videoDuration.current || vid.duration;
    if (!dur || !isFinite(dur)) return;
    vid.currentTime = Math.max(0, Math.min(p * dur, dur));
  });

  /* ─────────────────────────────────────────────
     SCROLL LOCK / UNLOCK
     While heroComplete is false, Lenis is stopped.
     We let native wheel events still reach the
     500vh hero div (position: sticky keeps working),
     but Lenis won't propagate momentum past that.
  ───────────────────────────────────────────── */
  useEffect(() => {
    if (!lenis) return;
    if (heroComplete) {
      lenis.start();
    } else {
      lenis.stop();
    }
    return () => { lenis.start(); }; // cleanup: always re-enable
  }, [lenis, heroComplete]);

  /* Watch progress — unlock when hero is done */
  useMotionValueEvent(smoothProgress, 'change', (p) => {
    if (!heroComplete && p >= HERO_DONE) {
      setHeroComplete(true);
      // Fade lock overlay out briefly before removing
      setTimeout(() => setLockVisible(false), 600);
    }
    // Re-lock if user scrolls back to top
    if (heroComplete && p < 0.05) {
      setHeroComplete(false);
      setLockVisible(true);
    }
  });

  /* ─────────────────────────────────────────────
     FRAME / MASK ANIMATION
     0% → 8% : inset 14px → 0, radius 12 → 0
  ───────────────────────────────────────────── */
  const maskInset  = useTransform(smoothProgress, [0, 0.08], [14, 0]);
  const maskRadius = useTransform(smoothProgress, [0, 0.08], [12, 0]);

  /* Overlay opacity curve */
  const overlayOp = useTransform(
    smoothProgress,
    [0,    0.05, 0.45, 0.85, 1],
    [0.78, 0.55, 0.45, 0.58, 0.75],
  );

  /* ── Border accent fades as frame opens ─── */
  const borderOp = useTransform(smoothProgress, [0, 0.10], [1, 0]);

  /* ─────────────────────────────────────────────
     TEXT SEGMENTS
     Seg 1  → 0.05 – 0.30  (brand reveal)
     Seg 2  → 0.38 – 0.62  (tagline)
     Seg 3  → 0.70 – end   (CTA, stays on screen)
  ───────────────────────────────────────────── */
  const seg1Op = useTransform(
    smoothProgress, [0.05, 0.18, 0.26, 0.36], [0, 1, 1, 0],
  );
  const seg1Y  = useTransform(smoothProgress, [0.05, 0.18], [22, 0]);

  const seg2Op = useTransform(
    smoothProgress, [0.38, 0.50, 0.58, 0.68], [0, 1, 1, 0],
  );
  const seg2Y  = useTransform(smoothProgress, [0.38, 0.50], [22, 0]);

  const seg3Op = useTransform(smoothProgress, [0.70, 0.82], [0, 1]);
  const seg3Y  = useTransform(smoothProgress, [0.70, 0.82], [22, 0]);

  /* Scroll hint fades on first scroll */
  const hintOp = useTransform(smoothProgress, [0, 0.05], [1, 0]);

  /* CTA scales in */
  const ctaScale = useTransform(smoothProgress, [0.82, 0.92], [0.94, 1]);

  /* ── Progress bar at bottom of viewport ─── */
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  /* ── Allow native scroll within the hero div */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Let the event pass through to update sticky position
    // (Lenis is stopped but native scroll on the 500vh div still works)
    e.stopPropagation();
  }, []);

  return (
    <>
      {/* ──────────────────────────────────────────
          SCROLL LOCK OVERLAY
          Sits on top of everything below the hero.
          Blocks pointer events reaching sections.
          Fades out after hero completes.
      ────────────────────────────────────────── */}
      {lockVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: heroComplete ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => {
            if (heroComplete) setLockVisible(false);
          }}
          /* Position below the 500vh hero so it covers the rest of the page */
          style={{ top: '500vh' }}
          className="fixed left-0 right-0 bottom-0 z-[200] pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* ──────────────────────────────────────────
          MAIN HERO CONTAINER  (500vh scroll space)
          onWheel handler lets native wheel reach
          the sticky child while Lenis is stopped.
      ────────────────────────────────────────── */}
      <div
        ref={containerRef}
        id="home"
        className="relative h-[500vh]"
        onWheel={handleWheel}
      >
        {/* ── STICKY VIEWPORT ──────────────────── */}
        <div className="sticky top-0 h-screen overflow-hidden bg-[#0d3320]">

          {/* ── Video frame / mask ─────────────── */}
          <motion.div
            style={{
              position: 'absolute',
              top:          maskInset,
              left:         maskInset,
              right:        maskInset,
              bottom:       maskInset,
              borderRadius: maskRadius,
              overflow:     'hidden',
            }}
            className="z-0"
          >
            {/* Poster — always present, fades behind video */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={POSTER_URL}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoReady ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Scrub video — preloaded, no autoplay */}
            <video
              ref={videoRef}
              src={VIDEO_URL}
              muted
              playsInline
              preload="auto"
              poster={POSTER_URL}
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Cinematic gradient overlay */}
            <motion.div
              style={{ opacity: overlayOp }}
              className="absolute inset-0 bg-gradient-to-b from-[#0d3320]/80 via-[#0d3320]/35 to-[#0d3320]/88"
            />
          </motion.div>

          {/* ── Gold frame border (opens on first scroll) */}
          <motion.div
            style={{ opacity: borderOp }}
            className="absolute inset-3 sm:inset-4 z-30 border border-[#d4af37]/20 rounded-xl pointer-events-none"
          />

          {/* ── Progress bar ───────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 z-40 h-[2px] bg-[#d4af37]/10">
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-[#d4af37]"
            />
          </div>

          {/* ─────────────────────────────────────
              TEXT SEGMENTS
          ───────────────────────────────────── */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">

            {/* SEGMENT 1 · Brand Reveal */}
            <motion.div
              style={{ opacity: seg1Op, y: seg1Y }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            >
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="h-px w-8 sm:w-12 bg-[#d4af37]" />
                <span className="font-paragraph text-[#d4af37] tracking-[0.35em] uppercase text-[9px] sm:text-[10px] font-semibold">
                  Private Estate Living · Karjat
                </span>
                <div className="h-px w-8 sm:w-12 bg-[#d4af37]" />
              </div>

              <h1 className="font-heading text-[3.5rem] sm:text-6xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] text-[#f5f1e8] leading-[0.88] tracking-tight">
                Karjat
                <br />
                <span className="italic text-[#d4af37]">Blooms</span>
              </h1>
            </motion.div>

            {/* SEGMENT 2 · Tagline */}
            <motion.div
              style={{ opacity: seg2Op, y: seg2Y }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            >
              <p className="font-paragraph text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#f5f1e8]/90 max-w-2xl leading-relaxed font-light tracking-wide">
                Where pristine wilderness
                <br className="hidden sm:block" />
                meets curated luxury.
              </p>
              <div className="mt-8 sm:mt-10 flex items-center gap-5">
                <div className="h-px w-14 bg-[#d4af37]/50" />
                <span className="font-paragraph text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-[#d4af37]">
                  Rudram Realty
                </span>
                <div className="h-px w-14 bg-[#d4af37]/50" />
              </div>
            </motion.div>

            {/* SEGMENT 3 · CTA (stays visible until end) */}
            <motion.div
              style={{ opacity: seg3Op, y: seg3Y }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            >
              <p className="font-paragraph text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-[#d4af37] mb-5 sm:mb-6">
                A Private Sanctuary · Karjat, Maharashtra
              </p>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#f5f1e8] italic leading-tight mb-8 sm:mb-10">
                Begin Your Legacy
              </h2>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-10 sm:mb-12">
                {[
                  { value: '100+', label: 'Curated Plots' },
                  { value: '90 km', label: 'From Mumbai' },
                  { value: '65 km', label: 'From Pune' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-heading text-2xl sm:text-3xl text-[#d4af37] leading-none mb-1">
                      {s.value}
                    </p>
                    <p className="font-paragraph text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#f5f1e8]/50">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <motion.div
                style={{ scale: ctaScale }}
                className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
              >
                <button
                  onClick={onEnquireClick}
                  className="font-paragraph bg-[#d4af37] text-[#0d3320] hover:bg-[#f5f1e8] px-8 sm:px-10 py-3.5 sm:py-4 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold transition-all duration-500"
                >
                  Enquire Now
                </button>

                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="font-paragraph text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#f5f1e8]/65 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-3 group border border-[#f5f1e8]/20 hover:border-[#d4af37]/40 px-5 sm:px-6 py-3.5 sm:py-4"
                >
                  Discover the Estate
                  <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-7" />
                </a>
              </motion.div>

              {/* "Scroll down" nudge shown when animation done */}
              <motion.p
                style={{
                  opacity: useTransform(smoothProgress, [0.90, 0.98], [0, 1]),
                }}
                className="font-paragraph text-[8px] tracking-[0.4em] uppercase text-[#f5f1e8]/30 mt-8"
              >
                Continue scrolling to explore
              </motion.p>
            </motion.div>

          </div>{/* end text layer */}

          {/* ── Scroll hint (fades immediately on scroll) */}
          <motion.div
            style={{ opacity: hintOp }}
            className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          >
            <span className="font-paragraph text-[7px] sm:text-[8px] uppercase tracking-[0.5em] text-[#f5f1e8]/30">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-7 bg-gradient-to-b from-[#d4af37] to-transparent"
            />
          </motion.div>

          {/* ── Scrub label (top-right) ─────────── */}
          <div
            className="absolute top-24 sm:top-28 right-4 sm:right-6 z-30 flex items-center gap-2 bg-[#0d3320]/60 backdrop-blur-sm border border-[#d4af37]/15 px-3 py-1.5 pointer-events-none"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-[#d4af37]/50">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span className="font-paragraph text-[8px] tracking-[0.2em] uppercase text-[#f5f1e8]/30">
              Scroll · Scrub
            </span>
          </div>

        </div>{/* end sticky */}
      </div>{/* end container */}
    </>
  );
}
