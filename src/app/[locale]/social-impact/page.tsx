"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, RefreshCw, Users, BookOpen, Leaf, Scale, Sparkles, MapPin } from "lucide-react";

export default function SocialImpactPage() {
  const t = useTranslations("socialImpact");

  const circularSteps = [
    { icon: <Sparkles className="h-6 w-6" />, title: t("circular1Title"), desc: t("circular1Desc"), color: "bg-blue-100 text-blue-700" },
    { icon: <Users className="h-6 w-6" />, title: t("circular2Title"), desc: t("circular2Desc"), color: "bg-emerald-100 text-emerald-700" },
    { icon: <BookOpen className="h-6 w-6" />, title: t("circular3Title"), desc: t("circular3Desc"), color: "bg-violet-100 text-violet-700" },
    { icon: <RefreshCw className="h-6 w-6" />, title: t("circular4Title"), desc: t("circular4Desc"), color: "bg-amber-100 text-amber-700" },
  ];

  const values = [
    { icon: <Heart className="h-6 w-6" />, title: t("value1Title"), desc: t("value1Desc"), color: "text-rose-600" },
    { icon: <BookOpen className="h-6 w-6" />, title: t("value2Title"), desc: t("value2Desc"), color: "text-blue-600" },
    { icon: <Scale className="h-6 w-6" />, title: t("value3Title"), desc: t("value3Desc"), color: "text-emerald-600" },
    { icon: <Leaf className="h-6 w-6" />, title: t("value4Title"), desc: t("value4Desc"), color: "text-green-600" },
  ];

  const stats = [
    { value: "50+", label: t("stat1Label") },
    { value: "200+", label: t("stat2Label") },
    { value: "15+", label: t("stat3Label") },
    { value: "3+", label: t("stat4Label") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-background to-emerald-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backHome")}
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium mb-4 uppercase tracking-wider">
              <RefreshCw className="h-3.5 w-3.5" />
              {t("heroBadge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6 leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("heroDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-headline mb-6">{t("missionTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("missionBody")}</p>
          </div>
        </div>
      </section>

      {/* Circular Economy */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline mb-3">{t("circularTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {circularSteps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow">
                  {i + 1}
                </div>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${step.color} mb-4`}>
                  {step.icon}
                </div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* You are a Sponsor */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-6">{t("sponsorsTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("sponsorsBody")}</p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">{t("impactTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</div>
                <div className="text-sm opacity-80 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold font-headline">{t("communityTitle")}</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("communityBody")}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">{t("valuesTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className={`${v.color} mb-4`}>{v.icon}</div>
                <h3 className="font-semibold text-base mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">{t("ctaTitle")}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">{t("ctaBody")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">{t("ctaShop")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/designer">{t("ctaDesign")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
