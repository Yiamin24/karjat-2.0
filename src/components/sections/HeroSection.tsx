'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const VIDEO_SRC      = '/hero-scrub-trimmed.mp4';
const SECTION_HEIGHT = 550; // vh — longer runway = more time to experience the scrub

export default function HeroSection({ onEnquireClick }: { onEnquireClick: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  /* These refs never cause re-renders */
  const rawProg    = useRef(0);
  const smoothProg = useRef(0);  // spring position
  const velocity   = useRef(0);  // spring velocity — gives momentum feel
  const duration   = useRef(0);
  const seekable   = useRef(false); // true once the video is actually seekable
  const isSeeking  = useRef(false); // mobile: don't stack seeks while one is pending
  const lastSeekT  = useRef(-1);    // last time value written — skip duplicate writes
  const isMobile   = useRef(false); // detected at mount
  const rafId      = useRef<number>(0);
  const lastTime   = useRef<number>(0);

  /* ─── VIDEO SETUP ─────────────────────────────────────── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    console.log('[HeroVideo] 🎬 Video element found, setting up...');
    console.log('[HeroVideo] src:', vid.src || VIDEO_SRC);

    // Detect mobile/tablet — iOS Safari and Android Chrome both need the seek-guard
    isMobile.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log('[HeroVideo] 📱 isMobile:', isMobile.current);

    vid.muted       = true;
    vid.playsInline = true;
    // mobile browsers ignore preload="auto" — metadata is the highest they honour
    vid.preload     = isMobile.current ? 'metadata' : 'auto';

    const grabDuration = () => {
      if (vid.duration && isFinite(vid.duration)) {
        duration.current = vid.duration;
        console.log('[HeroVideo] ✅ Duration captured:', vid.duration.toFixed(2), 's');
      } else {
        console.warn('[HeroVideo] ⚠️ Duration not available yet:', vid.duration);
      }
    };

    const checkSeekable = () => {
      // The video is only scrub-able once the browser reports a seekable range.
      // On live hosts this can take a moment while the moov/index is fetched.
      if (!seekable.current && vid.seekable.length > 0) {
        seekable.current = true;
        grabDuration();
        console.log('[HeroVideo] 🔓 Video is now seekable — scrubbing enabled');
        // On mobile, kick off a silent play→pause so the browser starts buffering
        // progressively. Without this, iOS only buffers ~1 chunk then stops.
        if (isMobile.current) {
          vid.play().then(() => {
            vid.pause();
            vid.currentTime = 0;
            console.log('[HeroVideo] 📱 Mobile buffer-prime: play→pause done');
          }).catch(() => {/* autoplay blocked — fine, scrub still works */});
        }
      }
    };

    vid.addEventListener('loadstart',      () => console.log('[HeroVideo] 📡 loadstart — browser started fetching'));
    vid.addEventListener('progress',       () => {
      checkSeekable(); // re-check seekable on every progress event
      console.log('[HeroVideo] 📥 progress — buffered:', vid.buffered.length > 0 ? `${(vid.buffered.end(0)).toFixed(1)}s` : 'nothing yet');
    });
    vid.addEventListener('loadedmetadata', () => { console.log('[HeroVideo] 📋 loadedmetadata — duration:', vid.duration, 'seekable:', vid.seekable.length > 0 ? `0–${vid.seekable.end(0).toFixed(2)}s` : 'NOT SEEKABLE'); grabDuration(); checkSeekable(); }, { once: true });
    vid.addEventListener('loadeddata',     () => { console.log('[HeroVideo] 🖼️ loadeddata — first frame ready'); grabDuration(); checkSeekable(); }, { once: true });
    vid.addEventListener('canplay',        () => { console.log('[HeroVideo] ▶️ canplay'); checkSeekable(); });
    vid.addEventListener('canplaythrough', () => { console.log('[HeroVideo] ✅ canplaythrough — fully buffered'); checkSeekable(); });
    vid.addEventListener('durationchange', () => { console.log('[HeroVideo] 🔄 durationchange:', vid.duration); grabDuration(); checkSeekable(); });
    vid.addEventListener('error',          () => console.error('[HeroVideo] ❌ VIDEO ERROR — code:', vid.error?.code, 'message:', vid.error?.message));
    vid.addEventListener('stalled',        () => { isSeeking.current = false; console.warn('[HeroVideo] ⏸️ stalled — network stalled'); });
    vid.addEventListener('waiting',        () => console.warn('[HeroVideo] ⌛ waiting — buffering'));
    vid.addEventListener('seeking',        () => { isSeeking.current = true;  console.log('[HeroVideo] 🔍 seeking to:', vid.currentTime.toFixed(3)); });
    vid.addEventListener('seeked',         () => { isSeeking.current = false; console.log('[HeroVideo] ✔️ seeked — landed at:', vid.currentTime.toFixed(3)); });

    vid.load();
    console.log('[HeroVideo] 🚀 vid.load() called');

    return () => {
      // cleanup listeners not needed — element unmounts
    };
  }, []);

  /* ─── SCROLL + RAF ────────────────────────────────────────
     Video scrub is pure DOM — NO setState here.
     Text overlay reads smoothProg ref via its own RAF.
  ──────────────────────────────────────────────────────────*/
  useEffect(() => {
    const section = sectionRef.current;
    const vid     = videoRef.current;
    if (!section || !vid) return;

    const onScroll = () => {
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      const total    = section.offsetHeight - window.innerHeight;
      const next     = Math.min(1, Math.max(0, scrolled / total));
      /* If direction changed sharply, bleed off velocity for crisp reversal */
      if (Math.sign(next - rawProg.current) !== Math.sign(velocity.current)) {
        velocity.current *= 0.3;
      }
      rawProg.current = next;
    };

    const tick = (timestamp: number) => {
      /* Delta time in seconds — frame-rate independent */
      const dt = lastTime.current ? Math.min((timestamp - lastTime.current) / 1000, 0.064) : 0.016;
      lastTime.current = timestamp;

      /* ── Spring physics ─────────────────────────────────
         Models a damped spring between smoothProg and rawProg.

         stiffness : How hard the spring pulls toward target
                     Higher = snappier catch-up
         damping   : Resistance — controls how quickly it settles
                     Higher = less bounce, more silky
         mass      : Inertia — heavier = slower to start/stop
                     This is what gives the premium weighted feel

         Tuned to feel like high-end native scroll:
         - Fast enough to feel responsive
         - Slow enough to feel weighted and intentional
         - Mobile: lighter mass so it catches up before seek stalls
      ──────────────────────────────────────────────────── */
      const stiffness = 55;
      const damping   = 18;
      // Mobile needs a much lighter spring — heavy inertia causes the smooth
      // position to lag far behind raw scroll, triggering seeks into unbuffered
      // ranges which stall on iOS/Android.
      const mass      = isMobile.current ? 0.8 : 2.2;

      const spring      = -stiffness * (smoothProg.current - rawProg.current);
      const damp        = -damping * velocity.current;
      const accel       = (spring + damp) / mass;

      velocity.current   += accel * dt;
      smoothProg.current += velocity.current * dt;

      /* Clamp to valid range */
      smoothProg.current = Math.min(1, Math.max(0, smoothProg.current));

      /* Deadzone: stop micro-oscillation when settled */
      if (
        Math.abs(velocity.current) < 0.00005 &&
        Math.abs(smoothProg.current - rawProg.current) < 0.00005
      ) {
        velocity.current   = 0;
        smoothProg.current = rawProg.current;
      }

      /* Write to video — only seek once the video is confirmed seekable on live hosts */
      if (seekable.current && duration.current > 0) {
        /* Leave 1 frame before true end — prevents black last-frame on some codecs */
        const maxTime    = duration.current - (1 / 30);
        const targetTime = Math.max(0, Math.min(smoothProg.current * duration.current, maxTime));

        // On mobile: skip seek if one is already pending (stacked seeks stall iOS Safari),
        // or if the value hasn't meaningfully changed (< 40ms threshold).
        const minDelta = isMobile.current ? 0.04 : 0.001;
        if (
          !isSeeking.current &&
          Math.abs(targetTime - lastSeekT.current) >= minDelta
        ) {
          lastSeekT.current   = targetTime;
          vid.currentTime     = targetTime;
        }
      } else {
        // Log once every ~3s to avoid spam
        if (Math.round(timestamp / 3000) !== Math.round((timestamp - dt * 1000) / 3000)) {
          console.warn('[HeroVideo] ⚠️ not seekable yet — readyState:', vid.readyState, 'seekable ranges:', vid.seekable.length, 'duration:', vid.duration);
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
  }, []); // start immediately — no dependency on ready

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{ height: `${SECTION_HEIGHT}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0d2b12]">

        {/* VIDEO — scrubs with scroll, no posters needed */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient — stronger to ensure text always readable over video */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>

        {/* Text — has its own RAF loop, reads smoothProg ref */}
        <HeroText smoothProg={smoothProg} onEnquireClick={onEnquireClick} />

        {/* Scroll hint */}
        <ScrollHint smoothProg={smoothProg} />

        {/* Progress bar */}
        <ProgressBar smoothProg={smoothProg} />

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Each UI sub-component has its OWN RAF loop that reads
   smoothProg ref and writes directly to the DOM via refs.
   Zero React re-renders during scroll — no flicker.
═══════════════════════════════════════════════════════════ */

function HeroText({
  smoothProg,
  onEnquireClick,
}: {
  smoothProg: React.MutableRefObject<number>;
  onEnquireClick: () => void;
}) {
  /* DOM refs — we animate these directly */
  const eyeRef   = useRef<HTMLDivElement>(null);
  const s1Ref    = useRef<HTMLDivElement>(null);
  const s2Ref    = useRef<HTMLDivElement>(null);
  const s3Ref    = useRef<HTMLDivElement>(null);
  const nudgeRef = useRef<HTMLDivElement>(null);
  const rafId    = useRef<number>();

  useEffect(() => {
    const tick = () => {
      const p = smoothProg.current;

      /* Eye brow */
      if (eyeRef.current) {
        eyeRef.current.style.opacity = String(clamp(p / 0.10));
      }

      /* S1: Title  0.00–0.38 */
      if (s1Ref.current) {
        const op = fadeInOut(p, 0, 0.10, 0.28, 0.38);
        const y  = slideIn(p, 0, 0.10);
        s1Ref.current.style.opacity   = String(op);
        s1Ref.current.style.transform = `translateY(${y}px)`;
      }

      /* S2: Tagline  0.35–0.66 */
      if (s2Ref.current) {
        const op = fadeInOut(p, 0.35, 0.45, 0.56, 0.66);
        const y  = slideIn(p, 0.35, 0.45);
        s2Ref.current.style.opacity   = String(op);
        s2Ref.current.style.transform = `translateY(${y}px)`;
      }

      /* S3: CTA  0.65–end */
      if (s3Ref.current) {
        const op = fadeInOut(p, 0.65, 0.78, 0.99, 1.00);
        const y  = slideIn(p, 0.65, 0.78);
        s3Ref.current.style.opacity   = String(op);
        s3Ref.current.style.transform = `translateY(${y}px)`;
      }

      /* Continue nudge */
      if (nudgeRef.current) {
        nudgeRef.current.style.opacity = String(clamp((p - 0.92) / 0.06));
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [smoothProg]);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>

      {/* EYEBROW */}
      <div
        ref={eyeRef}
        className="absolute top-[17%] left-0 right-0 flex justify-center"
        style={{ opacity: 0, willChange: 'opacity' }}
      >
        <div className="flex items-center gap-5">
          <div className="h-px w-10 sm:w-14 bg-[#d4af37]" />
          <span className="font-paragraph text-[#d4af37] text-[8px] sm:text-[9px] tracking-[0.45em] uppercase font-semibold"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Private Estate Living · Karjat
          </span>
          <div className="h-px w-10 sm:w-14 bg-[#d4af37]" />
        </div>
      </div>

      {/* S1: TITLE */}
      <div
        ref={s1Ref}
        className="absolute inset-0 flex items-center justify-center text-center px-6"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        <h1
          className="font-heading text-white leading-[0.86] tracking-[-0.01em]"
          style={{
            fontSize: 'clamp(4rem, 11vw, 10.5rem)',
            textShadow: '0 2px 20px rgba(0,0,0,0.7)',
          }}
        >
          Karjat
          <br />
          <span className="italic text-[#d4af37] font-light">Blooms</span>
        </h1>
      </div>

      {/* S2: TAGLINE */}
      <div
        ref={s2Ref}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        <p
          className="font-paragraph text-white font-light leading-[1.3] max-w-[600px]"
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 3.2rem)',
            textShadow: '0 2px 16px rgba(0,0,0,0.75)',
          }}
        >
          Where pristine wilderness
          <br />
          meets curated luxury.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <div className="h-px w-14 bg-[#d4af37]" />
          <span className="font-paragraph text-[#d4af37] text-[9px] tracking-[0.48em] uppercase font-semibold"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Rudram Realty
          </span>
          <div className="h-px w-14 bg-[#d4af37]" />
        </div>
      </div>

      {/* S3: CTA */}
      <div
        ref={s3Ref}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ opacity: 0, willChange: 'opacity, transform' }}
      >
        <p className="font-paragraph text-[#d4af37] text-[9px] sm:text-[10px] tracking-[0.5em] uppercase mb-5 font-semibold"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
          A Private Sanctuary · Karjat, Maharashtra
        </p>
        <h2
          className="font-heading text-white italic font-light leading-[0.88] mb-10"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 7.5rem)',
            textShadow: '0 2px 20px rgba(0,0,0,0.7)',
          }}
        >
          Begin Your Legacy
        </h2>
        <div className="flex flex-wrap justify-center gap-10 sm:gap-16 mb-10">
          {([['100+','Curated Plots'],['90 km','From Mumbai'],['65 km','From Pune']] as const).map(([v,l]) => (
            <div key={l} className="text-center">
              <div className="font-heading text-[#d4af37] leading-none mb-1.5"
                style={{
                  fontSize: 'clamp(1.6rem,2.8vw,2.6rem)',
                  textShadow: '0 1px 10px rgba(0,0,0,0.7)',
                }}>{v}</div>
              <div className="font-paragraph text-white/80 text-[8px] tracking-[0.32em] uppercase"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>{l}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
          <button
            onClick={onEnquireClick}
            className="font-paragraph bg-[#d4af37] text-[#060e08] hover:bg-white px-10 py-4 text-[9px] sm:text-[10px] tracking-[0.35em] uppercase font-bold transition-all duration-500 shadow-lg"
          >
            Enquire Now
          </button>
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-paragraph border border-white/50 hover:border-[#d4af37] text-white hover:text-[#d4af37] px-8 py-4 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase transition-all duration-300 flex items-center gap-3 group"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            Discover Estate
            <span className="inline-block w-4 h-px bg-current transition-all duration-300 group-hover:w-7" />
          </button>
        </div>

        {/* Continue nudge */}
        <div
          ref={nudgeRef}
          className="absolute bottom-10 flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span className="font-paragraph text-[7px] tracking-[0.5em] uppercase text-white/30">
            Continue scrolling
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-6 bg-gradient-to-b from-[#d4af37]/60 to-transparent"
          />
        </div>
      </div>

    </div>
  );
}

function ScrollHint({ smoothProg }: { smoothProg: React.MutableRefObject<number> }) {
  const ref   = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>();

  useEffect(() => {
    const tick = () => {
      if (ref.current) {
        ref.current.style.opacity = String(Math.max(0, 1 - smoothProg.current / 0.05));
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [smoothProg]);

  return (
    <div
      ref={ref}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
      style={{ zIndex: 10, willChange: 'opacity' }}
    >
      <span className="font-paragraph text-[7px] tracking-[0.55em] uppercase text-white/35">
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-px h-8 bg-gradient-to-b from-[#d4af37] to-transparent"
      />
    </div>
  );
}

function ProgressBar({ smoothProg }: { smoothProg: React.MutableRefObject<number> }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const rafId   = useRef<number>();

  useEffect(() => {
    const tick = () => {
      if (fillRef.current) {
        fillRef.current.style.width = `${smoothProg.current * 100}%`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [smoothProg]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/10" style={{ zIndex: 10 }}>
      <div ref={fillRef} className="h-full bg-[#d4af37]" style={{ width: '0%' }} />
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

const slideIn = (p: number, inS: number, inE: number, dist = 32) => {
  if (p <= inS) return dist;
  if (p >= inE) return 0;
  return dist * (1 - (p - inS) / (inE - inS));
};
