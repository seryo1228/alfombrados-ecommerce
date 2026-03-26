"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, ArrowLeft, Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { publicApi } from "@/lib/api";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
  widthCm: string | null;
  heightCm: string | null;
  featured: boolean;
  status?: string;
  salePriceUsd?: string | null;
}

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  all:            { es: "Todos", en: "All" },
  anime:          { es: "Anime", en: "Anime" },
  empresarial:    { es: "Empresarial", en: "Corporate" },
  lujo:           { es: "Lujo", en: "Luxury" },
  animales:       { es: "Animales", en: "Animals" },
  deportes:       { es: "Deportes", en: "Sports" },
  infantil:       { es: "Infantil", en: "Kids" },
  abstracto:      { es: "Abstracto", en: "Abstract" },
  personalizado:  { es: "Personalizado", en: "Custom" },
  oficina:        { es: "Oficina", en: "Office" },
  otro:           { es: "Otro", en: "Other" },
};

export default function GalleryPage() {
  const locale = useLocale();
  const isEs = locale === "es";

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    setLoading(true);
    publicApi
      .getGallery(activeCategory !== "all" ? activeCategory : undefined)
      .then((res) => {
        setItems(res.data);
        if (res.categories.length > 0) setCategories(res.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filteredItems = search
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const getDims = (item: PortfolioItem) => {
    if (item.widthCm && item.heightCm) {
      return `${Math.round(Number(item.widthCm))}×${Math.round(Number(item.heightCm))} cm`;
    }
    return null;
  };

  const allCategories = ["all", ...new Set([...categories, ...Object.keys(CATEGORY_LABELS).filter((k) => k !== "all")])];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEs ? "Volver al inicio" : "Back to home"}
          </Link>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 uppercase tracking-wider">
              <Palette className="h-3.5 w-3.5" />
              {isEs ? "Nuestro Trabajo" : "Our Work"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
              {isEs ? "Galería de Proyectos" : "Project Gallery"}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isEs
                ? "Explora nuestra colección de alfombras artesanales. Cada pieza es única, hecha a mano con dedicación y materiales premium."
                : "Explore our collection of handcrafted rugs. Each piece is unique, handmade with dedication and premium materials."}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {allCategories
                .filter((c) => c === "all" || categories.includes(c) || activeCategory === c)
                .map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setActiveCategory(cat); setSearch(""); }}
                    className="text-xs"
                  >
                    {CATEGORY_LABELS[cat]?.[isEs ? "es" : "en"] || cat}
                  </Button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isEs ? "Buscar proyectos..." : "Search projects..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            {filteredItems.length} {isEs ? "proyectos" : "projects"}
            {activeCategory !== "all" && (
              <span>
                {" "}
                {isEs ? "en" : "in"}{" "}
                <strong>{CATEGORY_LABELS[activeCategory]?.[isEs ? "es" : "en"]}</strong>
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <Palette className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {isEs ? "No hay proyectos en esta categoría" : "No projects in this category"}
              </h3>
              <p className="text-muted-foreground">
                {isEs
                  ? "Estamos trabajando en nuevos diseños. ¡Vuelve pronto!"
                  : "We're working on new designs. Come back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm font-medium text-foreground shadow-lg">
                          {isEs ? "Ver detalle" : "View detail"}
                        </div>
                      </div>
                    </div>
                    {/* Featured badge */}
                    {item.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-500 text-white border-0">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {isEs ? "Destacado" : "Featured"}
                        </Badge>
                      </div>
                    )}
                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-foreground text-xs">
                        {CATEGORY_LABELS[item.category]?.[isEs ? "es" : "en"] || item.category}
                      </Badge>
                    </div>
                    {/* Status badge */}
                    {item.status && (
                      <div className="absolute bottom-3 right-3">
                        <Badge className={`border-0 text-xs ${
                          item.status === "disponible"
                            ? "bg-emerald-500 text-white"
                            : item.status === "vendida"
                            ? "bg-red-500/80 text-white"
                            : "bg-amber-500 text-white"
                        }`}>
                          {item.status === "disponible"
                            ? (isEs ? "En Stock" : "In Stock")
                            : item.status === "vendida"
                            ? (isEs ? "Vendida" : "Sold")
                            : (isEs ? "Reservada" : "Reserved")}
                        </Badge>
                      </div>
                    )}
                    {/* Dims */}
                    {getDims(item) && (
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-md px-2.5 py-1 text-xs font-medium text-white">
                        {getDims(item)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full max-h-[60vh] object-contain bg-muted rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors text-lg"
              >
                ×
              </button>
              {selectedItem.featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-amber-500 text-white border-0">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {isEs ? "Destacado" : "Featured"}
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-headline">{selectedItem.title}</h2>
                  {selectedItem.description && (
                    <p className="text-muted-foreground mt-2">{selectedItem.description}</p>
                  )}
                </div>
                <Badge variant="outline" className="shrink-0">
                  {CATEGORY_LABELS[selectedItem.category]?.[isEs ? "es" : "en"] || selectedItem.category}
                </Badge>
              </div>
              {getDims(selectedItem) && (
                <p className="text-sm text-muted-foreground">
                  {isEs ? "Dimensiones" : "Dimensions"}: <strong>{getDims(selectedItem)}</strong>
                </p>
              )}
              {/* Status + Price */}
              <div className="flex items-center gap-3">
                <Badge className={`border-0 ${
                  selectedItem.status === "disponible"
                    ? "bg-emerald-500 text-white"
                    : selectedItem.status === "vendida"
                    ? "bg-red-500/80 text-white"
                    : "bg-amber-500 text-white"
                }`}>
                  {selectedItem.status === "disponible"
                    ? (isEs ? "Disponible" : "Available")
                    : selectedItem.status === "vendida"
                    ? (isEs ? "Vendida" : "Sold")
                    : (isEs ? "Reservada" : "Reserved")}
                </Badge>
                {selectedItem.status === "disponible" && selectedItem.salePriceUsd && Number(selectedItem.salePriceUsd) > 0 && (
                  <span className="text-2xl font-bold text-primary">
                    ${Number(selectedItem.salePriceUsd).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                {selectedItem.status === "disponible" ? (
                  <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <a
                      href={`https://wa.me/584120993377?text=${encodeURIComponent(
                        isEs
                          ? `Hola! Quiero comprar la alfombra "${selectedItem.title}" (${getDims(selectedItem) || ""}). ¿Está disponible?`
                          : `Hi! I want to buy the rug "${selectedItem.title}" (${getDims(selectedItem) || ""}). Is it available?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {isEs ? "Comprar por WhatsApp" : "Buy via WhatsApp"}
                    </a>
                  </Button>
                ) : (
                  <Button asChild className="flex-1">
                    <Link href="/designer">
                      <Palette className="mr-2 h-4 w-4" />
                      {isEs ? "Diseñar algo similar" : "Design something similar"}
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild className="flex-1">
                  <a
                    href={`https://wa.me/584120993377?text=${encodeURIComponent(
                      isEs
                        ? `Hola! Me interesa una alfombra como "${selectedItem.title}". ¿Pueden darme más información?`
                        : `Hi! I'm interested in a rug like "${selectedItem.title}". Can you give me more info?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4">
            {isEs ? "¿Quieres una alfombra única?" : "Want a unique rug?"}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            {isEs
              ? "Diseña tu propia alfombra con nuestro diseñador con IA o contáctanos para un diseño personalizado."
              : "Design your own rug with our AI designer or contact us for a custom design."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/designer">
                <Palette className="mr-2 h-5 w-5" />
                {isEs ? "Diseñar mi alfombra" : "Design my rug"}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://wa.me/584120993377"
                target="_blank"
                rel="noopener noreferrer"
              >
                {isEs ? "Contactar por WhatsApp" : "Contact via WhatsApp"}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
