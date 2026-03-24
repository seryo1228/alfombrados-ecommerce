"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  Scissors,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Yarn Ball Animation – realistic falling & bouncing yarn balls      */
/* ------------------------------------------------------------------ */
const YARN_COLORS = [
  // Real yarn / estambre colors
  { base: "#e74c3c", light: "#f1948a", dark: "#c0392b", shadow: "#922b21" }, // Rojo
  { base: "#e67e22", light: "#f0b27a", dark: "#d35400", shadow: "#a04000" }, // Naranja
  { base: "#f1c40f", light: "#f9e154", dark: "#d4ac0d", shadow: "#b7950b" }, // Amarillo
  { base: "#2ecc71", light: "#82e0aa", dark: "#27ae60", shadow: "#1e8449" }, // Verde
  { base: "#3498db", light: "#85c1e9", dark: "#2980b9", shadow: "#1f618d" }, // Azul
  { base: "#9b59b6", light: "#c39bd3", dark: "#8e44ad", shadow: "#6c3483" }, // Morado
  { base: "#e91e63", light: "#f48fb1", dark: "#c2185b", shadow: "#880e4f" }, // Rosa fuerte
  { base: "#1abc9c", light: "#76d7c4", dark: "#16a085", shadow: "#0e6655" }, // Turquesa
  { base: "#f39c12", light: "#f8c471", dark: "#e67e22", shadow: "#ca6f1e" }, // Dorado
  { base: "#ecf0f1", light: "#ffffff", dark: "#d5dbdb", shadow: "#b2babb" }, // Blanco crema
];

interface YarnBallData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: typeof YARN_COLORS[0];
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  wrapAngle: number; // unique wrap offset per ball
  trailLength: number; // small dangling thread
}

function YarnBallsAnimation() {
  const cleanupRef = useRef<(() => void) | null>(null);

  const canvasCallback = useCallback((canvas: HTMLCanvasElement | null) => {
    // Cleanup previous
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = parent.getBoundingClientRect();
    let W = rect.width;
    let H = rect.height;
    canvas.width = W;
    canvas.height = H;

    function onResize() {
      const r = parent!.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas!.width = W; canvas!.height = H;
    }
    window.addEventListener("resize", onResize);

    // Create balls
    const count = Math.min(Math.floor(W / 110), 12);
    const usedColors = new Set<number>();
    const balls: YarnBallData[] = Array.from({ length: count }, (_, i) => {
      let ci: number;
      do { ci = Math.floor(Math.random() * YARN_COLORS.length); }
      while (usedColors.has(ci) && usedColors.size < YARN_COLORS.length);
      usedColors.add(ci);
      return {
        id: i, x: Math.random() * (W - 60) + 30, y: -(Math.random() * 400 + 80),
        vx: (Math.random() - 0.5) * 1.5, vy: Math.random() * 0.8 + 0.2,
        radius: Math.random() * 16 + 16, color: YARN_COLORS[ci],
        rotation: Math.random() * Math.PI * 2, rotationSpeed: (Math.random() - 0.5) * 0.025,
        opacity: Math.random() * 0.25 + 0.55, wrapAngle: Math.random() * Math.PI,
        trailLength: Math.random() * 12 + 6,
      };
    });

    const fuzzyDots = balls.map(() =>
      Array.from({ length: 16 }, () => ({ a: Math.random() * Math.PI * 2, d: 0.7 + Math.random() * 0.3 }))
    );

    const G = 0.045, B = 0.45, FR = 0.9985;
    let running = true;

    function drawBall(b: YarnBallData, idx: number) {
      const r = b.radius, c = b.color;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);
      ctx.globalAlpha = b.opacity;

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = r * 0.6;
      ctx.shadowOffsetY = r * 0.15;

      // 3D sphere
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.08, 0, 0, r);
      grad.addColorStop(0, c.light); grad.addColorStop(0.35, c.base);
      grad.addColorStop(0.8, c.dark); grad.addColorStop(1, c.shadow);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();

      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

      // Yarn wraps
      ctx.lineCap = "round";
      for (let s = 0; s < 6; s++) {
        const a = b.wrapAngle + (s * Math.PI) / 6;
        const sm = r * (0.18 + s * 0.04), lw = r * 0.07;
        ctx.globalAlpha = b.opacity * 0.3; ctx.strokeStyle = c.dark; ctx.lineWidth = lw + 0.6;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.87, sm, a, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = b.opacity * 0.5; ctx.strokeStyle = c.base; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.87, sm, a, 0, Math.PI * 2); ctx.stroke();
      }

      // Light strand
      ctx.globalAlpha = b.opacity * 0.25; ctx.strokeStyle = c.light; ctx.lineWidth = r * 0.09;
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.84, r * 0.2, b.wrapAngle + 0.3, 0, Math.PI * 2); ctx.stroke();

      // Fuzzy dots
      ctx.globalAlpha = b.opacity * 0.12; ctx.fillStyle = c.light;
      for (const dot of fuzzyDots[idx]) {
        ctx.beginPath(); ctx.arc(Math.cos(dot.a) * r * dot.d, Math.sin(dot.a) * r * dot.d, 0.9, 0, Math.PI * 2); ctx.fill();
      }

      // Specular
      ctx.globalAlpha = b.opacity * 0.45;
      const sp = ctx.createRadialGradient(-r * 0.3, -r * 0.35, 0, -r * 0.3, -r * 0.35, r * 0.35);
      sp.addColorStop(0, "rgba(255,255,255,0.7)"); sp.addColorStop(0.5, "rgba(255,255,255,0.15)"); sp.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = sp; ctx.fill();

      // Thread tail
      ctx.globalAlpha = b.opacity * 0.55; ctx.strokeStyle = c.base; ctx.lineWidth = 1.5;
      const tx = r * 0.55, ty = r * 0.35;
      ctx.beginPath(); ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(tx + b.trailLength * 0.4, ty + b.trailLength * 0.6, tx + b.trailLength * 0.15, ty + b.trailLength);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(tx + b.trailLength * 0.15, ty + b.trailLength + 2.5, 2, 0, Math.PI * 2); ctx.stroke();

      ctx.restore();
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const floor = H - 8;
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        b.vy += G; b.x += b.vx; b.y += b.vy; b.vx *= FR; b.rotation += b.rotationSpeed;
        if (b.y + b.radius > floor) { b.y = floor - b.radius; b.vy = -Math.abs(b.vy) * B; b.rotationSpeed *= 0.92; b.vx += (Math.random() - 0.5) * 0.4; }
        if (b.x - b.radius < 0) { b.x = b.radius; b.vx = Math.abs(b.vx) * B; }
        if (b.x + b.radius > W) { b.x = W - b.radius; b.vx = -Math.abs(b.vx) * B; }
        drawBall(b, i);
      }
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    cleanupRef.current = () => { running = false; window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasCallback} className="absolute inset-0 pointer-events-none z-0" style={{ width: "100%", height: "100%" }} />;
}

/* ------------------------------------------------------------------ */
/*  Portfolio data – placeholder images using colored gradients        */
/* ------------------------------------------------------------------ */
/*  Portfolio items
    ──────────────────────────────────────────────────────────────────
    Para agregar tus fotos reales:
    1. Coloca imágenes JPG/PNG en  public/portfolio/  (ej: 1.jpg, 2.jpg…)
    2. Cambia el campo `image` de null a "/portfolio/1.jpg"
    3. El gradient se usa como fallback mientras no haya imagen
    ────────────────────────────────────────────────────────────────── */
const PORTFOLIO_ITEMS = [
  { id: 1, image: null as string | null, gradient: "from-rose-400 via-pink-300 to-orange-300", dims: "120×80 cm", label: "Diseño Floral" },
  { id: 2, image: null as string | null, gradient: "from-violet-400 via-purple-300 to-indigo-300", dims: "100×100 cm", label: "Retrato Personalizado" },
  { id: 3, image: null as string | null, gradient: "from-emerald-400 via-teal-300 to-cyan-300", dims: "150×100 cm", label: "Logo Corporativo" },
  { id: 4, image: null as string | null, gradient: "from-amber-400 via-yellow-300 to-orange-300", dims: "90×90 cm", label: "Diseño Abstracto" },
  { id: 5, image: null as string | null, gradient: "from-sky-400 via-blue-300 to-indigo-300", dims: "200×150 cm", label: "Paisaje Artístico" },
  { id: 6, image: null as string | null, gradient: "from-pink-400 via-rose-300 to-red-300", dims: "80×80 cm", label: "Mascota Custom" },
];

/* ------------------------------------------------------------------ */
/*  Stats counters                                                     */
/* ------------------------------------------------------------------ */
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
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/15">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
        {/* decorative blobs – brighter for dark bg */}
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

        {/* Falling yarn balls */}
        <YarnBallsAnimation />

        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              {t("hero.badge")}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <Link href="/designer">
                  <Palette className="mr-2 h-5 w-5" />
                  {t("hero.cta")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/products">
                  {t("hero.ctaSecondary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section className="border-y bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 150, suffix: "+", label: t("stats.rugsCreated") },
              { value: 50, suffix: "+", label: t("stats.happyClients") },
              { value: 12, suffix: "", label: t("stats.workshopsGiven") },
              { value: 3, suffix: "", label: t("stats.yearsExperience") },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PORTFOLIO CAROUSEL ═══════════════════ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 uppercase tracking-wider">
              <Scissors className="h-3.5 w-3.5" />
              {t("portfolio.badge")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("portfolio.title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("portfolio.subtitle")}
            </p>
          </div>

          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {PORTFOLIO_ITEMS.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500">
                    <CardContent className="p-0">
                      <div
                        className={`aspect-square relative overflow-hidden ${item.image ? "bg-muted" : `bg-gradient-to-br ${item.gradient}`}`}
                      >
                        {item.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.image}
                            alt={item.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          /* Placeholder con pattern + label */
                          <>
                            <div className="absolute inset-0 opacity-20">
                              <svg className="w-full h-full" viewBox="0 0 200 200">
                                <defs>
                                  <pattern id={`p-${item.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="8" fill="white" fillOpacity="0.3" />
                                  </pattern>
                                </defs>
                                <rect width="200" height="200" fill={`url(#p-${item.id})`} />
                              </svg>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white/60 font-medium text-sm">{item.label}</span>
                            </div>
                          </>
                        )}
                        {/* hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm font-medium text-foreground shadow-lg">
                              {t("portfolio.viewProject")}
                            </div>
                          </div>
                        </div>
                        {/* dims badge */}
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-md px-2.5 py-1 text-xs font-medium text-white">
                          {item.dims}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm">
                          {t(`portfolio.items.item${item.id}.title`)}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t(`portfolio.items.item${item.id}.description`)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>

          <div className="text-center mt-10">
            <Button variant="outline" asChild className="group">
              <Link href="/designer">
                {t("portfolio.seeAll")}
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT US – SOCIAL PROJECT ═══════════════════ */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left – visual */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 border border-primary/20 overflow-hidden relative">
                {/* Decorative tufting illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15">
                      <Heart className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <div className="w-3 h-3 rounded-full bg-sky-400" />
                      <div className="w-3 h-3 rounded-full bg-violet-400" />
                    </div>
                  </div>
                </div>
                {/* yarn texture lines */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
              </div>
              {/* floating card */}
              <div className="absolute -bottom-6 -right-4 md:-right-6 bg-card border rounded-xl p-4 shadow-lg max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary leading-none">50+</p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                      {t("about.floatingCard")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right – text content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                <Heart className="h-3.5 w-3.5" />
                {t("about.badge")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {t("about.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.description1")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.description2")}
              </p>

              {/* Mission pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    icon: Heart,
                    title: t("about.pillars.impact.title"),
                    desc: t("about.pillars.impact.description"),
                  },
                  {
                    icon: Sparkles,
                    title: t("about.pillars.craft.title"),
                    desc: t("about.pillars.craft.description"),
                  },
                  {
                    icon: Users,
                    title: t("about.pillars.community.title"),
                    desc: t("about.pillars.community.description"),
                  },
                  {
                    icon: GraduationCap,
                    title: t("about.pillars.education.title"),
                    desc: t("about.pillars.education.description"),
                  },
                ].map((pillar, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <pillar.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{pillar.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES / SERVICES ═══════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("features.title")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: t("features.custom.title"),
              description: t("features.custom.description"),
              href: "/designer",
            },
            {
              icon: Package,
              title: t("features.materials.title"),
              description: t("features.materials.description"),
              href: "/products",
            },
            {
              icon: GraduationCap,
              title: t("features.courses.title"),
              description: t("features.courses.description"),
              href: "/courses",
            },
          ].map((feature, i) => (
            <Link href={feature.href} key={i}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════ REVIEWS / TESTIMONIALS ═══════════════════ */}
      <section className="bg-gradient-to-b from-background to-secondary/30 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 uppercase tracking-wider">
              <Star className="h-3.5 w-3.5" />
              {t("reviews.badge")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("reviews.title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("reviews.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  {/* quote icon */}
                  <Quote className="h-8 w-8 text-primary/15 absolute top-4 right-4" />

                  {/* stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* review text */}
                  <p className="text-sm leading-relaxed text-muted-foreground mb-6 italic">
                    &ldquo;{t(`reviews.items.review${i}.text`)}&rdquo;
                  </p>

                  {/* author */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {t(`reviews.items.review${i}.name`).charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {t(`reviews.items.review${i}.name`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(`reviews.items.review${i}.role`)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CATEGORIES ═══════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("categories.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: t("categories.rugs"),
                href: "/designer",
                icon: "🎨",
                bg: "from-rose-500/10 to-orange-500/10",
              },
              {
                title: t("categories.yarn"),
                href: "/products?category=estambre",
                icon: "🧶",
                bg: "from-violet-500/10 to-purple-500/10",
              },
              {
                title: t("categories.tools"),
                href: "/products?category=pistola",
                icon: "🔧",
                bg: "from-blue-500/10 to-cyan-500/10",
              },
              {
                title: t("categories.courses"),
                href: "/courses",
                icon: "📚",
                bg: "from-green-500/10 to-emerald-500/10",
              },
            ].map((cat, i) => (
              <Link href={cat.href} key={i}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                  <CardContent className={`p-6 bg-gradient-to-br ${cat.bg}`}>
                    <div className="text-4xl mb-3">{cat.icon}</div>
                    <h3 className="font-semibold">{cat.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA FINAL ═══════════════════ */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/designer">
                <Palette className="mr-2 h-5 w-5" />
                {t("cta.designBtn")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">
                {t("cta.shopBtn")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
