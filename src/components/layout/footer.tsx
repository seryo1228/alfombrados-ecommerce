"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Scissors, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <Scissors className="h-6 w-6 text-primary" />
              Alfombrados
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              {t("about")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">{t("links")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">{tn("products")}</Link></li>
              <li><Link href="/designer" className="hover:text-primary transition-colors">{tn("designer")}</Link></li>
              <li><Link href="/courses" className="hover:text-primary transition-colors">{tn("courses")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">{t("contact")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <a href="https://wa.me/584120993377" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <a href="https://instagram.com/alfombra2_ve" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  @alfombra2_ve
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                <a href="https://tiktok.com/@alfombra2_ve" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  @alfombra2_ve
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Alfombrados. {t("rights")}.</p>
        </div>
      </div>
    </footer>
  );
}
