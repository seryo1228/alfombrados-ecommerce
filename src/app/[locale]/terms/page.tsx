"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  const t = useTranslations("terms");

  const sections = [
    { title: t("section1Title"), body: t("section1Body") },
    { title: t("section2Title"), body: t("section2Body") },
    { title: t("section3Title"), body: t("section3Body") },
    { title: t("section4Title"), body: t("section4Body") },
    { title: t("section5Title"), body: t("section5Body") },
    { title: t("section6Title"), body: t("section6Body") },
    { title: t("section7Title"), body: t("section7Body") },
    { title: t("section8Title"), body: t("section8Body") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backHome")}
          </Link>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5" />
              Alfombra2
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">{t("title")}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("subtitle")}</p>
            <p className="text-sm text-muted-foreground mt-4">{t("lastUpdated")}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i} className="border-b border-slate-100 pb-8 last:border-0">
                <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </div>
            ))}

            {/* Contact */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h2 className="text-xl font-bold mb-3">{t("section9Title")}</h2>
              <p className="text-muted-foreground mb-4">{t("section9Body")}</p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">WhatsApp:</span>{" "}
                  <a href="https://wa.me/584120993377" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    +58 412-0993377
                  </a>
                </p>
                <p>
                  <span className="font-medium">Instagram:</span>{" "}
                  <a href="https://instagram.com/alfombra2_ve" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    @alfombra2_ve
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
