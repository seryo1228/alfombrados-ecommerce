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
} from "lucide-react";
import { useState, useEffect } from "react";
import { publicApi } from "@/lib/api";

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
      <section className="relative overflow-hidden bg-white min-h-[640px] md:min-h-[700px] flex items-center">

        {/* Blue right panel — desktop only */}
        <div
          className="hidden md:block absolute inset-y-0 right-0 w-5/12 overflow-hidden"
          style={{ backgroundColor: BRAND.blue }}
          aria-hidden="true"
        >
          {/* Tufting dot pattern — represents rug loops */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tuft" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="6" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tuft)"/>
          </svg>
          {/* Soft left fade so text area stays clean */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" style={{width: '30%'}} />
          {/* Brand color stripe at bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex h-1.5" style={{opacity: 0.8}}>
            {[BRAND.tint, "#ffffff", BRAND.sky, BRAND.tint, "#ffffff"].map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* Mobile top brand stripe */}
        <div className="md:hidden absolute top-0 left-0 right-0 flex h-1" aria-hidden="true">
          {[BRAND.tint, BRAND.blue, BRAND.sky, BRAND.deep, BRAND.tint].map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-xl animate-fade-in-up">
            {/* Location label — not a badge pill */}
            <p className="text-sm font-semibold tracking-wide mb-5 flex items-center gap-2" style={{ color: BRAND.blue }}>
              <Heart className="h-3.5 w-3.5" />
              {isEs ? "Proyecto Social · San Antonio de los Altos, Venezuela" : "Social Project · San Antonio de los Altos, Venezuela"}
            </p>

            <h1 className="text-4xl md:text-[3.25rem] font-bold font-headline mb-6 leading-[1.1] tracking-tight text-wrap-balance">
              {t("hero.title")}
            </h1>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary CTA: WhatsApp */}
              <a
                href="https://wa.me/584120993377"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: BRAND.wa }}
              >
                <WhatsAppIcon className="h-5 w-5" />
                {isEs ? "Cotizar por WhatsApp" : "Quote on WhatsApp"}
              </a>

              {/* Secondary CTA: Designer */}
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{ borderColor: BRAND.blue, color: BRAND.blue }}
              >
                <Link href="/designer">
                  <Palette className="mr-2 h-5 w-5" />
                  {t("hero.cta")}
                </Link>
              </Button>
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
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("portfolio.title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("portfolio.subtitle")}
            </p>
          </div>

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

            {/* Left: visual */}
            <div className="relative">
              <div
                className="aspect-[4/3] rounded-2xl overflow-hidden relative flex items-end"
                style={{ backgroundColor: BRAND.deep }}
              >
                {/* Rug pattern art — placeholder until real photo */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="rug-about" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="8" fill="white"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#rug-about)"/>
                </svg>
                {/* Color band at bottom representing yarn diversity */}
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
      <section className="border-y bg-white">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 150, suffix: "+", label: t("stats.rugsCreated") },
              { value: 50,  suffix: "+", label: t("stats.happyClients") },
              { value: 12,  suffix: "",  label: t("stats.workshopsGiven") },
              { value: 3,   suffix: "",  label: t("stats.yearsExperience") },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl md:text-4xl font-bold" style={{ color: BRAND.blue }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("features.title")}</h2>
          <p className="text-muted-foreground max-w-xl">{t("features.subtitle")}</p>
        </div>

        {/* Asymmetric layout: large card left + 2 stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Large feature */}
          <Link href="/designer">
            <div
              className="group relative rounded-2xl p-8 md:p-10 h-full min-h-[260px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: BRAND.deep, color: "white" }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="feat-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="14" cy="14" r="5" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#feat-dots)"/>
              </svg>
              <div className="relative z-10 flex flex-col h-full">
                <Sparkles className="h-8 w-8 mb-6 opacity-90" />
                <h3 className="text-xl font-bold mb-3">{t("features.custom.title")}</h3>
                <p className="text-sm opacity-80 leading-relaxed flex-1">{t("features.custom.description")}</p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold opacity-90 group-hover:gap-2 transition-all">
                  {isEs ? "Diseñar ahora" : "Design now"} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Two stacked features */}
          <div className="flex flex-col gap-6">
            <Link href="/products">
              <div
                className="group rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md border"
                style={{ borderColor: BRAND.tint, backgroundColor: "white" }}
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: BRAND.tint }}>
                    <Package className="h-5 w-5" style={{ color: BRAND.deep }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">{t("features.materials.title")}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t("features.materials.description")}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: BRAND.blue }}>
                      {isEs ? "Ver materiales" : "Browse materials"} <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/courses">
              <div
                className="group rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md border"
                style={{ borderColor: BRAND.tint, backgroundColor: "white" }}
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: BRAND.tint }}>
                    <GraduationCap className="h-5 w-5" style={{ color: BRAND.deep }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">{t("features.courses.title")}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t("features.courses.description")}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: BRAND.blue }}>
                      {isEs ? "Ver cursos" : "Browse courses"} <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ REVIEWS ══════════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: "#f8faff" }}>
        <div className="container mx-auto px-4">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("reviews.title")}</h2>
            <p className="text-muted-foreground max-w-xl">{t("reviews.subtitle")}</p>
          </div>

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
        <div className="container mx-auto px-4 py-20 text-center">
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
        </div>
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
