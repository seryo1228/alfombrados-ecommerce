"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Truck, Globe, Package, Clock, MessageCircle, AlertTriangle, MapPin } from "lucide-react";

export default function ShippingPolicyPage() {
  const t = useTranslations("shippingPolicy");

  const sections = [
    { icon: <MapPin className="h-5 w-5" />, title: t("section1Title"), body: t("section1Body"), color: "bg-blue-100 text-blue-700" },
    { icon: <Globe className="h-5 w-5" />, title: t("section2Title"), body: t("section2Body"), color: "bg-emerald-100 text-emerald-700" },
    { icon: <Package className="h-5 w-5" />, title: t("section3Title"), body: t("section3Body"), color: "bg-violet-100 text-violet-700" },
    { icon: <Clock className="h-5 w-5" />, title: t("section4Title"), body: t("section4Body"), color: "bg-amber-100 text-amber-700" },
    { icon: <MessageCircle className="h-5 w-5" />, title: t("section5Title"), body: t("section5Body"), color: "bg-sky-100 text-sky-700" },
    { icon: <AlertTriangle className="h-5 w-5" />, title: t("section6Title"), body: t("section6Body"), color: "bg-red-100 text-red-700" },
    { icon: <Truck className="h-5 w-5" />, title: t("section7Title"), body: t("section7Body"), color: "bg-slate-100 text-slate-700" },
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
              <Truck className="h-3.5 w-3.5" />
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
          <div className="space-y-6">
            {sections.map((section, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${section.color}`}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold mb-2">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center">
              <MessageCircle className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <p className="font-semibold mb-4 text-slate-800">¿Tienes preguntas sobre tu envío?</p>
              <a
                href="https://wa.me/584120993377"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-colors"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp +58 412-0993377
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
