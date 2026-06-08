"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Package,
  GraduationCap,
  ArrowRight,
  Palette,
  Heart,
  Users,
  Star,
  Quote,
  ChevronRight,
  Globe,
  Hand,
  MessageCircle,
  Video,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

/* Inline Instagram icon — lucide-react v1 doesn't export it */
function Instagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { useState, useEffect, useRef } from "react";
import { publicApi } from "@/lib/api";
import { Reveal } from "@/components/reveal";

/* ─── Brand colors ─────────────────────────────────────────── */
const BRAND = {
  blue:    "#1779c2",
  deep:    "#2354a2",
  sky:     "#369cdb",
  tint:    "#d1e1fb",
  wa:      "#25D366",
  waDark:  "#1ebe5d",
} as const;

/* ─── WhatsApp icon ─────────────────────────────────────────── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

/* ─── Portfolio placeholder data ────────────────────────────── */
const PORTFOLIO_ITEMS = [
  { id: 1, image: null as string | null, gradient: "from-rose-400 via-pink-300 to-orange-300", dims: "120×80 cm", label: "Diseño Floral" },
  { id: 2, image: null as string | null, gradient: "from-blue-400 via-sky-300 to-cyan-300",    dims: "100×100 cm", label: "Retrato Personalizado" },
  { id: 3, image: null as string | null, gradient: "from-emerald-400 via-teal-300 to-cyan-300",dims: "150×100 cm", label: "Logo Corporativo" },
  { id: 4, image: null as string | null, gradient: "from-amber-400 via-yellow-300 to-orange-300", dims: "90×90 cm", label: "Diseño Abstracto" },
  { id: 5, image: null as string | null, gradient: "from-sky-400 via-blue-300 to-indigo-300",  dims: "200×150 cm", label: "Paisaje Artístico" },
  { id: 6, image: null as string | null, gradient: "from-pink-400 via-rose-300 to-red-300",    dims: "80×80 cm",  label: "Mascota Custom" },
];

/* ─── Animated counter ──────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 2000;
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById(`counter-${target}`);
    if (el) observer.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [target]);

  return (
    <span id={`counter-${target}`} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

/* ─── Workshop videos ───────────────────────────────────────────────
   Soporta CUATRO fuentes mezcladas en la misma lista:

   1) Local MP4         { src: "/videos/workshop-1.mp4" }
   2) YouTube Short     { src: "https://www.youtube.com/shorts/VIDEO_ID" }
   3) Instagram Reel    { src: "https://www.instagram.com/reel/SHORTCODE/" }
   4) TikTok            { src: "https://www.tiktok.com/@user/video/VIDEO_ID" }

   Recomendación: YouTube Shorts da el embed más limpio (sin chrome de marca).
   ─────────────────────────────────────────────────────────────────── */
type VideoSource = { src: string; poster?: string };
const WORKSHOP_VIDEOS: VideoSource[] = [
  // { src: "/videos/workshop-1.mp4" },
  // { src: "https://www.youtube.com/shorts/VIDEO_ID" },
  // { src: "https://www.instagram.com/reel/SHORTCODE/" },
];

/* ─── URL detection helpers ─── */
type VideoKind = "local" | "youtube" | "instagram" | "tiktok";

function detectKind(url: string): VideoKind {
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/tiktok\.com/i.test(url)) return "tiktok";
  return "local";
}

function extractYouTubeId(url: string): string | null {
  // matches: /shorts/ID, /watch?v=ID, /embed/ID, youtu.be/ID
  const patterns = [
    /youtube\.com\/shorts\/([\w-]+)/i,
    /youtube\.com\/watch\?v=([\w-]+)/i,
    /youtube\.com\/embed\/([\w-]+)/i,
    /youtu\.be\/([\w-]+)/i,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function extractInstagramShortcode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/i);
  return m ? m[1] : null;
}

function extractTikTokId(url: string): string | null {
  const m = url.match(/tiktok\.com\/[^/]+\/video\/(\d+)/i);
  return m ? m[1] : null;
}

/* ─── Single-video renderer (handles all 4 sources) ─── */
function VideoPlayer({
  source,
  muted,
  playing,
  videoRef,
  onEnded,
  onClick,
}: {
  source: VideoSource;
  muted: boolean;
  playing: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onEnded: () => void;
  onClick: () => void;
}) {
  const kind = detectKind(source.src);

  if (kind === "youtube") {
    const id = extractYouTubeId(source.src);
    if (!id) return null;
    // autoplay=1 + mute=1 needed for browser autoplay policy
    // loop=1 needs playlist=ID for single-video loop
    const params = new URLSearchParams({
      autoplay: playing ? "1" : "0",
      mute: muted ? "1" : "0",
      loop: "1",
      playlist: id,
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });
    return (
      <iframe
        key={source.src}
        src={`https://www.youtube.com/embed/${id}?${params.toString()}`}
        title="Workshop video"
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (kind === "instagram") {
    const code = extractInstagramShortcode(source.src);
    if (!code) return null;
    return (
      <iframe
        key={source.src}
        src={`https://www.instagram.com/p/${code}/embed/`}
        title="Workshop reel"
        className="absolute inset-0 w-full h-full"
        scrolling="no"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }

  if (kind === "tiktok") {
    const id = extractTikTokId(source.src);
    if (!id) return null;
    return (
      <iframe
        key={source.src}
        src={`https://www.tiktok.com/embed/v2/${id}`}
        title="Workshop tiktok"
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }

  // local mp4
  return (
    /* eslint-disable-next-line jsx-a11y/media-has-caption */
    <video
      ref={videoRef}
      key={source.src}
      src={source.src}
      poster={source.poster}
      autoPlay
      muted={muted}
      playsInline
      onEnded={onEnded}
      onClick={onClick}
      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
    />
  );
}

function WorkshopVideos({ isEs }: { isEs: boolean }) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasVideos = WORKSHOP_VIDEOS.length > 0;
  const current = hasVideos ? WORKSHOP_VIDEOS[index] : null;
  const currentKind = current ? detectKind(current.src) : "local";
  const isIframe = currentKind !== "local";

  // Drive local <video> playback
  useEffect(() => {
    if (!hasVideos || isIframe) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (playing) v.play().catch(() => {/* autoplay blocked */});
    else v.pause();
  }, [index, muted, playing, hasVideos, isIframe]);

  // For iframes (YouTube/IG/TikTok), auto-rotate on a timer since we can't
  // detect end of playback across origins
  useEffect(() => {
    if (!hasVideos || !isIframe || WORKSHOP_VIDEOS.length < 2 || !playing) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % WORKSHOP_VIDEOS.length);
    }, 25000);
    return () => clearTimeout(t);
  }, [index, isIframe, hasVideos, playing]);

  const next = () => setIndex((i) => (i + 1) % WORKSHOP_VIDEOS.length);

  /* ─── Empty state ─── */
  if (!hasVideos) {
    return (
      <div
        className="aspect-[4/3] rounded-2xl overflow-hidden relative flex items-end"
        style={{ backgroundColor: BRAND.deep }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="rug-about" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="8" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rug-about)"/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <a
            href="https://instagram.com/alfombra2_ve"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex flex-col items-center gap-3 text-white text-center px-6"
          >
            <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Instagram className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold">
                {isEs ? "Mira el taller en Instagram" : "See the workshop on Instagram"}
              </p>
              <p className="text-sm opacity-75">@alfombra2_ve</p>
            </div>
          </a>
        </div>
        <div className="relative z-10 w-full">
          <div className="flex h-1">
            {[BRAND.tint, "#ffffff", BRAND.sky, BRAND.blue, BRAND.tint, "#ffffff", BRAND.sky].map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="bg-black/30 backdrop-blur-sm px-5 py-4 text-white">
            <p className="text-xs font-medium opacity-70 uppercase tracking-wider mb-0.5">
              {isEs ? "Nuestro Taller" : "Our Workshop"}
            </p>
            <p className="text-sm font-semibold">San Antonio de los Altos, Venezuela</p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Active player ─── */
  return (
    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-black group">
      <VideoPlayer
        source={current!}
        muted={muted}
        playing={playing}
        videoRef={videoRef}
        onEnded={next}
        onClick={() => setPlaying((p) => !p)}
      />

      {/* Controls: only meaningful for local <video> (we can't control iframes
          from a different origin). The iframe player has its own controls
          inside, so we just show the mute toggle when local. */}
      {!isIframe && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? (isEs ? "Activar sonido" : "Unmute") : (isEs ? "Silenciar" : "Mute")}
            className="h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? (isEs ? "Pausar" : "Pause") : (isEs ? "Reproducir" : "Play")}
            className="h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
          </button>
        </div>
      )}

      {/* Instagram link (always visible) */}
      <a
        href="https://instagram.com/alfombra2_ve"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-medium transition-colors"
      >
        <Instagram className="h-3.5 w-3.5" />
        @alfombra2_ve
      </a>

      {/* Indicators */}
      {WORKSHOP_VIDEOS.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {WORKSHOP_VIDEOS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Video ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <div className="flex h-1">
          {[BRAND.tint, "#ffffff", BRAND.sky, BRAND.blue, BRAND.tint, "#ffffff", BRAND.sky].map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent px-5 py-4 text-white">
          <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-0.5">
            {isEs ? "Nuestro Taller" : "Our Workshop"}
          </p>
          <p className="text-sm font-semibold">San Antonio de los Altos, Venezuela</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Portfolio image type ──────────────────────────────────── */
interface PortfolioImage {
  url: string;
  title?: string;
  dims?: string;
}

/* ════════════════════════════════════════════════════════════ */
/*  Home Page                                                   */
/* ════════════════════════════════════════════════════════════ */
interface PortfolioItem {
  id: number;
  image: string | null;
  gradient: string;
  dims: string;
  label: string;
}

export default function HomePage() {
  const t  = useTranslations("home");
  const locale = useLocale();
  const isEs = locale === "es";
  const [erpPortfolio, setErpPortfolio] = useState<PortfolioImage[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Lock body scroll + ESC to close while lightbox is open
  useEffect(() => {
    if (!selectedItem) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedItem(null); };
    window.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [selectedItem]);

  // Subtle parallax on hero portfolio cards — driven by Lenis when available,
  // falls back to IntersectionObserver-based passive listener otherwise.
  // Each card has its own ref + a per-card multiplier so they move at slightly
  // different speeds for depth.
  const heroCard1Ref = useRef<HTMLButtonElement | null>(null);
  const heroCard2Ref = useRef<HTMLButtonElement | null>(null);
  const heroCard3Ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const refs = [
      { el: heroCard1Ref.current, factor: -0.08 },
      { el: heroCard2Ref.current, factor:  0.06 },
      { el: heroCard3Ref.current, factor: -0.10 },
    ];

    let rafId: number;
    let lastScrollY = window.scrollY;
    let ticking = false;

    function apply() {
      ticking = false;
      const y = lastScrollY;
      for (const { el, factor } of refs) {
        if (!el) continue;
        // Translate is relative to the document scroll, capped to keep
        // cards from drifting too far out of their slot
        const offset = Math.max(-40, Math.min(40, y * factor * 0.25));
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    }

    function onScroll() {
      lastScrollY = window.scrollY;
      if (!ticking) {
        rafId = requestAnimationFrame(apply);
        ticking = true;
      }
    }

    // Use Lenis's scroll event if present (smoother), else native passive
    const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: (v: { scroll: number }) => void) => void; off: (e: string, cb: (v: { scroll: number }) => void) => void } }).__lenis;
    const lenisHandler = (v: { scroll: number }) => { lastScrollY = v.scroll; if (!ticking) { rafId = requestAnimationFrame(apply); ticking = true; } };

    if (lenis) {
      lenis.on("scroll", lenisHandler);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    apply();

    return () => {
      cancelAnimationFrame(rafId);
      if (lenis) lenis.off("scroll", lenisHandler);
      else window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    publicApi.getConfig().then((config) => {
      try {
        const imgs = config?.portfolio?.images;
        if (Array.isArray(imgs) && imgs.length > 0) {
          setErpPortfolio(imgs as PortfolioImage[]);
        }
      } catch { /* ignore */ }
    }).catch(() => {});
  }, []);

  const portfolioItems = erpPortfolio.length > 0
    ? erpPortfolio.map((img, i) => ({
        id: 1000 + i,
        image: img.url,
        gradient: "",
        dims: img.dims || "",
        label: img.title || `Proyecto ${i + 1}`,
      }))
    : PORTFOLIO_ITEMS;

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className="relative overflow-hidden bg-white">
        {/* Soft brand-color blobs for depth */}
        <div
          className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ backgroundColor: BRAND.tint }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 -left-40 w-[460px] h-[460px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: BRAND.sky }}
          aria-hidden="true"
        />

        {/* Mobile top brand stripe */}
        <div className="md:hidden absolute top-0 left-0 right-0 flex h-1 z-10" aria-hidden="true">
          {[BRAND.tint, BRAND.blue, BRAND.sky, BRAND.deep, BRAND.tint].map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        <div className="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* ─── Left column: text ─── */}
            <div className="lg:col-span-7 animate-fade-in-up">
              {/* Location pill */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6"
                style={{ backgroundColor: BRAND.tint + "80", color: BRAND.deep }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: BRAND.blue }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: BRAND.blue }} />
                </span>
                {isEs ? "Proyecto social · San Antonio de los Altos, Venezuela" : "Social project · San Antonio de los Altos, Venezuela"}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-bold font-headline mb-6 leading-[1.05] tracking-tight" style={{ textWrap: "balance" }}>
                {t("hero.title")}
              </h1>

              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href="https://wa.me/584120993377"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-base shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                  style={{ backgroundColor: BRAND.wa }}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {isEs ? "Cotizar por WhatsApp" : "Quote on WhatsApp"}
                </a>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-base font-semibold h-[52px] transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ borderColor: BRAND.blue, color: BRAND.blue, borderWidth: 2 }}
                >
                  <Link href="/designer">
                    <Palette className="mr-2 h-5 w-5" />
                    {t("hero.cta")}
                  </Link>
                </Button>
              </div>

              {/* Trust micro-row */}
              <div className="flex items-center gap-6 pt-6 border-t border-slate-200">
                <div className="flex -space-x-2">
                  {[BRAND.blue, BRAND.deep, BRAND.sky].map((c, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: c }}
                    >
                      {["M", "C", "A"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>50+</strong> {isEs ? "clientes felices alrededor del mundo" : "happy clients around the world"}
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Right column: visual grid ─── */}
            <div className="lg:col-span-5 relative">
              <div className="grid grid-cols-2 gap-3 md:gap-4 relative">
                {/* Card 1 — top left, square */}
                <button
                  ref={heroCard1Ref}
                  type="button"
                  onClick={() => portfolioItems[0] && setSelectedItem(portfolioItems[0])}
                  aria-label={isEs ? "Ver proyecto" : "View project"}
                  className="aspect-square rounded-2xl overflow-hidden relative group shadow-md hover:shadow-xl transition-shadow duration-500 border-0 p-0 will-change-transform"
                  style={{ backgroundColor: portfolioItems[0]?.image ? undefined : BRAND.deep }}
                >
                  {portfolioItems[0]?.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={portfolioItems[0].image} alt={portfolioItems[0].label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${portfolioItems[0]?.gradient || "from-blue-400 to-blue-600"}`}>
                      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="hero-p1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="3" fill="white" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hero-p1)" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Card 2 — right, tall (spans 2 rows) */}
                <button
                  ref={heroCard2Ref}
                  type="button"
                  onClick={() => portfolioItems[1] && setSelectedItem(portfolioItems[1])}
                  aria-label={isEs ? "Ver proyecto" : "View project"}
                  className="row-span-2 rounded-2xl overflow-hidden relative group shadow-md hover:shadow-xl transition-shadow duration-500 border-0 p-0 will-change-transform"
                  style={{ backgroundColor: portfolioItems[1]?.image ? undefined : BRAND.blue }}
                >
                  {portfolioItems[1]?.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={portfolioItems[1].image} alt={portfolioItems[1].label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${portfolioItems[1]?.gradient || "from-indigo-400 to-purple-600"}`}>
                      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="hero-p2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="3" fill="white" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hero-p2)" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Card 3 — bottom left, square */}
                <button
                  ref={heroCard3Ref}
                  type="button"
                  onClick={() => portfolioItems[2] && setSelectedItem(portfolioItems[2])}
                  aria-label={isEs ? "Ver proyecto" : "View project"}
                  className="aspect-square rounded-2xl overflow-hidden relative group shadow-md hover:shadow-xl transition-shadow duration-500 border-0 p-0 will-change-transform"
                  style={{ backgroundColor: portfolioItems[2]?.image ? undefined : BRAND.sky }}
                >
                  {portfolioItems[2]?.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={portfolioItems[2].image} alt={portfolioItems[2].label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${portfolioItems[2]?.gradient || "from-emerald-400 to-teal-600"}`}>
                      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="hero-p3" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="3" fill="white" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hero-p3)" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Floating "view gallery" badge */}
                <Link
                  href="/gallery"
                  className="absolute -bottom-3 -left-3 bg-white rounded-full pl-2 pr-4 py-2 shadow-lg flex items-center gap-2 text-xs font-semibold border hover:shadow-xl transition-shadow"
                  style={{ borderColor: BRAND.tint, color: BRAND.deep }}
                >
                  <span className="h-7 w-7 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: BRAND.blue }}>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  {isEs ? "Ver galería completa" : "Browse full gallery"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ TRUST STRIP ══════════════════════ */}
      <section className="border-y" style={{ backgroundColor: BRAND.tint + "40" }}>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Globe,         label: isEs ? "Envíos a todo el mundo" : "Worldwide shipping",          sub: isEs ? "Venezuela y exterior"   : "Venezuela & international" },
              { icon: Hand,          label: isEs ? "100% hecho a mano"      : "100% handmade",               sub: isEs ? "Cada alfombra es única" : "Every rug is one of a kind" },
              { icon: Video,         label: isEs ? "Cursos presenciales y digitales" : "In-person & digital courses", sub: isEs ? "Aprende a tu ritmo"     : "Learn at your pace" },
              { icon: MessageCircle, label: isEs ? "Soporte por WhatsApp"   : "WhatsApp support",            sub: isEs ? "Respuesta rápida"       : "Quick response" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "white", color: BRAND.blue }}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate" style={{ color: BRAND.deep }}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PORTFOLIO ══════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("portfolio.title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("portfolio.subtitle")}
            </p>
          </Reveal>

          {/* Infinite marquee — duplicates the item list so the loop is seamless */}
          <div
            className="marquee-mask marquee-pause overflow-hidden w-full"
            style={{ ['--marquee-duration' as string]: `${Math.max(30, portfolioItems.length * 6)}s` }}
          >
            <div className="marquee-track flex gap-6 w-max">
              {[...portfolioItems, ...portfolioItems].map((item, idx) => (
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  key={`${item.id}-${idx}`}
                  aria-hidden={idx >= portfolioItems.length ? "true" : undefined}
                  aria-label={isEs ? `Ver proyecto: ${item.label}` : `View project: ${item.label}`}
                  className="block w-[280px] sm:w-[320px] lg:w-[360px] shrink-0 text-left p-0 border-0 bg-transparent"
                >
                  <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer">
                    <CardContent className="p-0">
                      <div className={`aspect-square relative overflow-hidden ${item.image ? "bg-muted" : `bg-gradient-to-br ${item.gradient}`}`}>
                        {item.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.image}
                            alt={item.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 opacity-20">
                              <svg className="w-full h-full" viewBox="0 0 200 200">
                                <defs>
                                  <pattern id={`p-${item.id}-${idx}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="8" fill="white" fillOpacity="0.3" />
                                  </pattern>
                                </defs>
                                <rect width="200" height="200" fill={`url(#p-${item.id}-${idx})`} />
                              </svg>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white/70 font-medium text-sm">{item.label}</span>
                            </div>
                          </>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm font-medium text-foreground shadow-lg">
                              {t("portfolio.viewProject")}
                            </div>
                          </div>
                        </div>
                        {item.dims && (
                          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-md px-2.5 py-1 text-xs font-medium text-white">
                            {item.dims}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm">
                          {item.id >= 1000 ? item.label : t(`portfolio.items.item${item.id}.title`)}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.id >= 1000 ? (item.dims || "") : t(`portfolio.items.item${item.id}.description`)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" asChild className="group">
              <Link href="/gallery">
                {t("portfolio.seeAll")}
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════ ABOUT — SOCIAL PROJECT ══════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "#f8faff" }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: workshop videos */}
            <div className="relative">
              <WorkshopVideos isEs={isEs} />

              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-4 md:-right-6 bg-white border rounded-xl p-4 shadow-lg max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRAND.tint}` }}>
                    <Users className="h-4 w-4" style={{ color: BRAND.deep }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none" style={{ color: BRAND.blue }}>50+</p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                      {t("about.floatingCard")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: text */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {t("about.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t("about.description1")}</p>
              <p className="text-muted-foreground leading-relaxed">{t("about.description2")}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { icon: Heart,         title: t("about.pillars.impact.title"),    desc: t("about.pillars.impact.description") },
                  { icon: Sparkles,      title: t("about.pillars.craft.title"),     desc: t("about.pillars.craft.description") },
                  { icon: Users,         title: t("about.pillars.community.title"), desc: t("about.pillars.community.description") },
                  { icon: GraduationCap, title: t("about.pillars.education.title"), desc: t("about.pillars.education.description") },
                ].map((pillar, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: BRAND.tint }}>
                      <pillar.icon className="h-4 w-4" style={{ color: BRAND.deep }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{pillar.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/social-impact" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline transition-colors" style={{ color: BRAND.blue }}>
                {isEs ? "Conoce el modelo de economía circular" : "Learn about our circular economy model"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ STATS BAR ══════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[
              { value: 150, suffix: "+", label: t("stats.rugsCreated"),     accent: BRAND.blue,  icon: Sparkles },
              { value: 50,  suffix: "+", label: t("stats.happyClients"),    accent: BRAND.deep,  icon: Heart },
              { value: 12,  suffix: "",  label: t("stats.workshopsGiven"),  accent: BRAND.sky,   icon: GraduationCap },
              { value: 3,   suffix: "",  label: t("stats.yearsExperience"), accent: BRAND.blue,  icon: Star },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative rounded-2xl p-6 border border-slate-200/80 bg-white hover:shadow-lg hover:-translate-y-1 hover:border-transparent transition-all duration-300 overflow-hidden"
              >
                {/* Decorative dot in corner */}
                <div
                  className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500"
                  style={{ backgroundColor: stat.accent }}
                  aria-hidden="true"
                />
                {/* Hairline accent on hover */}
                <div
                  className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: stat.accent }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <stat.icon className="h-4 w-4" style={{ color: stat.accent, opacity: 0.6 }} />
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      {stat.label}
                    </p>
                  </div>
                  <p className="text-4xl md:text-5xl font-extrabold tabular-nums leading-none" style={{ color: stat.accent }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════ FEATURES (BENTO) ══════════════════════ */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <Reveal className="mb-12 md:mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("features.title")}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t("features.subtitle")}
          </p>
        </Reveal>

        {/* Bento grid: 4-col / 2-row. Asymmetric, varied visual treatments per cell */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-5 auto-rows-fr">

          {/* Cell 1 — LARGE: Diseñador IA (col-span-2, row-span-2) */}
          <Link href="/designer" className="md:col-span-2 md:row-span-2">
            <div
              className="group relative rounded-3xl p-8 md:p-10 h-full min-h-[320px] md:min-h-[480px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
              style={{ backgroundColor: BRAND.deep, color: "white" }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="feat-dots-1" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="16" cy="16" r="6" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#feat-dots-1)"/>
              </svg>

              <div
                className="absolute top-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                style={{ backgroundColor: BRAND.sky }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center backdrop-blur-md"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                    {isEs ? "Con IA" : "AI-powered"}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    {t("features.custom.title")}
                  </h3>
                  <p className="text-base opacity-85 leading-relaxed max-w-md mb-6">
                    {t("features.custom.description")}
                  </p>
                  <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm self-start transition-all group-hover:gap-3"
                    style={{ backgroundColor: "white", color: BRAND.deep }}
                  >
                    {isEs ? "Diseñar ahora" : "Design now"}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Cell 2 — Materials (col-span-2, top row) */}
          <Link href="/products" className="md:col-span-2">
            <div
              className="group relative rounded-3xl p-7 h-full min-h-[200px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border bg-white"
              style={{ borderColor: BRAND.tint }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

              <div className="relative flex items-start gap-5 h-full">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-[6deg] transition-transform duration-500"
                  style={{ backgroundColor: BRAND.tint }}
                >
                  <Package className="h-7 w-7" style={{ color: BRAND.deep }} />
                </div>

                <div className="flex-1 flex flex-col h-full">
                  <h3 className="font-bold text-lg md:text-xl mb-2">{t("features.materials.title")}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                    {t("features.materials.description")}
                  </p>
                  <div className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all self-start" style={{ color: BRAND.blue }}>
                    {isEs ? "Ver materiales" : "Browse materials"} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Cell 3 — Cursos (col-span-1, bottom row) */}
          <Link href="/courses" className="md:col-span-1">
            <div
              className="group relative rounded-3xl p-6 h-full min-h-[200px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
              style={{ backgroundColor: BRAND.tint }}
            >
              <GraduationCap className="h-8 w-8 mb-4 group-hover:scale-110 transition-transform duration-500" style={{ color: BRAND.deep }} />
              <h3 className="font-bold text-base mb-1" style={{ color: BRAND.deep }}>
                {t("features.courses.title")}
              </h3>
              <p className="text-xs leading-relaxed flex-1 mb-3" style={{ color: BRAND.deep, opacity: 0.75 }}>
                {t("features.courses.description")}
              </p>
              <div className="inline-flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: BRAND.blue }}>
                {isEs ? "Ver cursos" : "View courses"} <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>

          {/* Cell 4 — WhatsApp CTA (col-span-1, bottom row) */}
          <a
            href="https://wa.me/584120993377"
            target="_blank"
            rel="noopener noreferrer"
            className="md:col-span-1 group relative rounded-3xl p-6 min-h-[200px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between text-white"
            style={{ backgroundColor: BRAND.wa }}
          >
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors duration-500" aria-hidden="true" />
            <WhatsAppIcon className="h-8 w-8 relative" />
            <div className="relative">
              <p className="text-base font-bold leading-tight mb-1">
                {isEs ? "¿Necesitas ayuda?" : "Need help?"}
              </p>
              <p className="text-xs opacity-90 leading-relaxed mb-3">
                {isEs ? "Habla con un asesor por WhatsApp" : "Chat with an advisor on WhatsApp"}
              </p>
              <div className="inline-flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all">
                {isEs ? "Escribir" : "Chat now"} <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ══════════════════════ REVIEWS ══════════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "#f8faff" }}>
        <div className="container mx-auto px-4">
          <Reveal className="mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("reviews.title")}</h2>
            <p className="text-muted-foreground max-w-xl">{t("reviews.subtitle")}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 absolute top-4 right-4" style={{ color: BRAND.tint }} />
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-6 italic">
                    &ldquo;{t(`reviews.items.review${i}.text`)}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND.tint }}>
                      <span className="text-sm font-bold" style={{ color: BRAND.deep }}>
                        {t(`reviews.items.review${i}.name`).charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t(`reviews.items.review${i}.name`)}</p>
                      <p className="text-xs text-muted-foreground">{t(`reviews.items.review${i}.role`)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CATEGORIES ══════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("categories.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: t("categories.rugs"),    href: "/designer",              icon: "🎨", bg: "from-rose-500/10 to-orange-500/10",       subtitle: "" },
              { title: t("categories.yarn"),    href: "/products?category=estambre", icon: "🧶", bg: "from-sky-500/10 to-blue-500/10",     subtitle: "" },
              { title: t("categories.tools"),   href: "/products?category=pistola",  icon: "🔧", bg: "from-blue-500/10 to-indigo-500/10",  subtitle: "" },
              { title: t("categories.courses"), href: "/courses",               icon: "📚", bg: "from-emerald-500/10 to-teal-500/10",     subtitle: isEs ? "Presenciales + Digitales" : "In-person + Digital" },
            ].map((cat, i) => (
              <Link href={cat.href} key={i}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden h-full">
                  <CardContent className={`p-6 bg-gradient-to-br ${cat.bg} h-full`}>
                    <div className="text-4xl mb-3">{cat.icon}</div>
                    <h3 className="font-semibold">{cat.title}</h3>
                    {cat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{cat.subtitle}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA FINAL ══════════════════════ */}
      <section style={{ background: `linear-gradient(135deg, ${BRAND.tint}40 0%, white 50%, ${BRAND.tint}30 100%)` }}>
        <Reveal className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild style={{ backgroundColor: BRAND.blue }} className="text-white hover:opacity-90 transition-opacity">
              <Link href="/designer">
                <Palette className="mr-2 h-5 w-5" />
                {t("cta.designBtn")}
              </Link>
            </Button>
            <a
              href="https://wa.me/584120993377"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90"
              style={{ backgroundColor: BRAND.wa }}
            >
              <WhatsAppIcon className="h-5 w-5" />
              {isEs ? "Contactar por WhatsApp" : "Contact on WhatsApp"}
            </a>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════ PROJECT LIGHTBOX ══════════════════════ */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.label}
        >
          <button
            type="button"
            onClick={() => setSelectedItem(null)}
            aria-label={isEs ? "Cerrar" : "Close"}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full w-11 h-11 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={selectedItem.image}
                alt={selectedItem.label}
                className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
              />
            ) : (
              /* Placeholder when no real image yet — large gradient with label */
              <div className={`w-full max-w-2xl aspect-square rounded-xl shadow-2xl bg-gradient-to-br ${selectedItem.gradient} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <defs>
                      <pattern id="lightbox-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="8" fill="white" fillOpacity="0.3" />
                      </pattern>
                    </defs>
                    <rect width="200" height="200" fill="url(#lightbox-pattern)" />
                  </svg>
                </div>
                <span className="text-white/80 text-2xl font-semibold relative z-10">{selectedItem.label}</span>
              </div>
            )}

            {/* Info bar below image */}
            <div className="mt-5 w-full max-w-3xl bg-white/95 backdrop-blur rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {selectedItem.id >= 1000
                    ? selectedItem.label
                    : t(`portfolio.items.item${selectedItem.id}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selectedItem.id >= 1000
                    ? (selectedItem.dims || "")
                    : t(`portfolio.items.item${selectedItem.id}.description`)}
                </p>
                {selectedItem.dims && selectedItem.id < 1000 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {isEs ? "Dimensiones" : "Dimensions"}: <strong>{selectedItem.dims}</strong>
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button asChild variant="outline">
                  <Link href="/gallery" onClick={() => setSelectedItem(null)}>
                    {isEs ? "Ver toda la galería" : "Browse gallery"}
                  </Link>
                </Button>
                <a
                  href={`https://wa.me/584120993377?text=${encodeURIComponent(
                    isEs
                      ? `Hola! Me interesa una alfombra como "${selectedItem.label}". ¿Pueden darme más información?`
                      : `Hi! I'm interested in a rug like "${selectedItem.label}". Can you tell me more?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: BRAND.wa }}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {isEs ? "Cotizar" : "Get quote"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
