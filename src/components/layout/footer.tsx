"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MessageCircle } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="font-headline font-extrabold text-xl text-blue-900 mb-3">
              Alfombra2
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Socially Weaving Futures in San Antonio de los Altos. Transforming lives through the art of tufting.
            </p>
            <p className="text-sm text-blue-700 font-medium mt-3">
              International Shipping Available 🌍
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Explorar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Impact Mission
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Categor&iacute;as</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  M&aacute;quinas
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Lanas &amp; Hilos
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Bastidores
                </Link>
              </li>
            </ul>
          </div>

          {/* Siguenos */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">S&iacute;guenos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <a href="https://instagram.com/alfombra2_ve" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Instagram @alfombra2_ve
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                <a href="https://tiktok.com/@alfombra2_ve" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  TikTok @alfombra2_ve
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <a href="https://wa.me/584120993377" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6">
          <p className="text-sm text-muted-foreground text-center">
            &copy; 2024 Alfombra2. Socially Weaving Futures in San Antonio de los Altos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
