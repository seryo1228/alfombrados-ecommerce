"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ShoppingCart, Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart";
import { LanguageSwitcher } from "./language-switcher";
import { CurrencySwitcher } from "./currency-switcher";

/* Brand palette tokens (kept here so the navbar is self-contained) */
const BRAND = {
  blue: "#1779c2",
  deep: "#2354a2",
  sky:  "#369cdb",
  tint: "#d1e1fb",
} as const;

const navLinks = [
  { href: "/",          key: "home",      icon: Home },
  { href: "/products",  key: "products" },
  { href: "/gallery",   key: "gallery" },
  { href: "/designer",  key: "designer" },
  { href: "/courses",   key: "courses" },
] as const;

/* ─── Weaving stripe ────────────────────────────────────────────
   Thin row of brand-color loops at the bottom of the navbar,
   slowly translating left to right. Reads as a tufting gun laying
   yarn loops in sequence. One motion moment, motivated. */
function WeavingStripe() {
  // 24 loops repeated twice for a seamless marquee
  const colors = [BRAND.blue, BRAND.sky, BRAND.deep, BRAND.tint, BRAND.blue, BRAND.sky];
  const loops = Array.from({ length: 24 });

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[6px] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="weave-track flex items-center gap-2 h-full w-max">
        {[...loops, ...loops].map((_, i) => (
          <span
            key={i}
            className="block h-1.5 w-1.5 rounded-full shrink-0"
            style={{ backgroundColor: colors[i % colors.length], opacity: 0.85 }}
          />
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const isEs = locale === "es";
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="container mx-auto flex h-[68px] items-center justify-between gap-4 px-4 relative">

        {/* ─── Logo lockup ─── */}
        <Link
          href="/"
          aria-label={isEs ? "Ir al inicio" : "Go to home"}
          className="group flex items-center gap-2.5 font-headline font-black text-xl tracking-tight transition-colors"
          style={{ color: BRAND.deep }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" className="h-9 w-9 transition-transform duration-300 group-hover:rotate-[8deg]" />
          <span className="group-hover:opacity-80 transition-opacity">Alfombra2</span>
        </Link>

        {/* ─── Desktop nav ─── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = "icon" in link ? link.icon : null;
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`
                  relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md
                  transition-colors
                  ${isActive
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }
                `}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{t(link.key)}</span>
                {isActive && (
                  <span
                    className="absolute left-2 right-2 -bottom-[10px] h-[3px] rounded-full"
                    style={{ backgroundColor: BRAND.blue }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ─── Right cluster ─── */}
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <CurrencySwitcher />
            <LanguageSwitcher />
          </div>

          <Link href="/cart" aria-label={isEs ? "Ver carrito" : "View cart"}>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-slate-100">
              <ShoppingCart className="h-5 w-5" style={{ color: BRAND.deep }} />
              {mounted && totalItems() > 0 && (
                <Badge
                  className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] rounded-full p-0 flex items-center justify-center text-[10px] border-2 border-white"
                  style={{ backgroundColor: BRAND.blue }}
                >
                  {totalItems()}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" style={{ color: BRAND.deep }} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              {/* Mobile language + currency at the top */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b">
                <CurrencySwitcher />
                <LanguageSwitcher />
              </div>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = "icon" in link ? link.icon : null;
                  return (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg
                        transition-colors
                        ${isActive
                          ? "text-white"
                          : "text-slate-700 hover:bg-slate-100"
                        }
                      `}
                      style={isActive ? { backgroundColor: BRAND.blue } : undefined}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{t(link.key)}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* ─── Weaving stripe (signature moment) ─── */}
        <WeavingStripe />
      </div>
    </header>
  );
}
