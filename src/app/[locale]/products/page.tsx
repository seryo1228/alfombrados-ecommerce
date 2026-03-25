"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Package,
  Palette,
  Truck,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart";
import {
  useCurrencyStore,
  formatPrice,
} from "@/components/layout/currency-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import { SHOP_CATEGORIES, CATEGORY_MAP } from "@/lib/constants";
import { publicApi } from "@/lib/api";
import type { Product } from "@/types";
import { toast } from "sonner";

/* ──────────────────────────────────────────────────────────────────
   Rugs in stock — ready-to-ship designs
   Para agregar alfombras reales:
   1. Coloca fotos en  public/rugs/  (ej: floral-rose.jpg)
   2. Actualiza el campo `image` con la ruta "/rugs/floral-rose.jpg"
   ────────────────────────────────────────────────────────────────── */
interface RugDesign {
  id: number;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  size: string;
  priceUsd: number;
  image: string | null;
  gradient: string; // fallback if no image
  stock: number;
  featured?: boolean;
}

const MOCK_RUGS: RugDesign[] = [
  {
    id: 101, name: "Floral Rose Garden", nameEs: "Jardín de Rosas Floral",
    description: "Handcrafted floral design with rose motifs in soft pink tones",
    descriptionEs: "Diseño floral artesanal con motivos de rosas en tonos rosa suave",
    size: "100×80 cm", priceUsd: 120, image: null,
    gradient: "from-rose-400 via-pink-300 to-rose-200", stock: 1, featured: true,
  },
  {
    id: 102, name: "Ocean Waves Abstract", nameEs: "Olas del Mar Abstracto",
    description: "Abstract wave pattern inspired by the Caribbean sea",
    descriptionEs: "Patrón abstracto de olas inspirado en el mar Caribe",
    size: "120×80 cm", priceUsd: 150, image: null,
    gradient: "from-sky-400 via-blue-300 to-cyan-200", stock: 1, featured: true,
  },
  {
    id: 103, name: "Geometric Sunset", nameEs: "Atardecer Geométrico",
    description: "Bold geometric shapes in warm sunset colors",
    descriptionEs: "Formas geométricas audaces en cálidos colores de atardecer",
    size: "90×90 cm", priceUsd: 110, image: null,
    gradient: "from-amber-400 via-orange-300 to-yellow-200", stock: 1,
  },
  {
    id: 104, name: "Tropical Leaves", nameEs: "Hojas Tropicales",
    description: "Lush tropical leaf design with deep green tones",
    descriptionEs: "Diseño de hojas tropicales exuberantes en tonos verde profundo",
    size: "150×100 cm", priceUsd: 200, image: null,
    gradient: "from-emerald-400 via-green-300 to-teal-200", stock: 1,
  },
  {
    id: 105, name: "Galaxy Nebula", nameEs: "Nebulosa Galáctica",
    description: "Cosmic design with purple and blue nebula swirls",
    descriptionEs: "Diseño cósmico con remolinos de nebulosa morada y azul",
    size: "100×100 cm", priceUsd: 140, image: null,
    gradient: "from-violet-400 via-purple-300 to-indigo-300", stock: 1,
  },
  {
    id: 106, name: "Minimalist Lines", nameEs: "Líneas Minimalistas",
    description: "Clean minimalist design with elegant line patterns",
    descriptionEs: "Diseño minimalista limpio con patrones de líneas elegantes",
    size: "80×80 cm", priceUsd: 95, image: null,
    gradient: "from-gray-300 via-slate-200 to-gray-100", stock: 1,
  },
];

const ITEMS_PER_PAGE = 9;

/* ══════════════════════════════════════════════════════════════════ */

export default function ProductsPage() {
  const t = useTranslations("products");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const addItem = useCartStore((s) => s.addItem);
  const { currency, exchangeRate } = useCurrencyStore();

  // Sidebar filter checkboxes
  const [showRugs, setShowRugs] = useState(true);
  const [showMaterials, setShowMaterials] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products from ERP API
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showMaterials) return;
    setLoading(true);
    setError(null);
    publicApi
      .getProducts({
        category: category !== "all" ? category : undefined,
        search: search || undefined,
      })
      .then((res) => setProducts(res.data))
      .catch(() => setError("Error loading products"))
      .finally(() => setLoading(false));
  }, [showMaterials, category, search]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sortBy, showRugs, showMaterials, priceRange]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    result = result.filter(
      (p) =>
        (p.salePriceUsd || 0) >= priceRange[0] &&
        (p.salePriceUsd || 0) <= priceRange[1]
    );
    switch (sortBy) {
      case "priceLow":
        result.sort((a, b) => (a.salePriceUsd || 0) - (b.salePriceUsd || 0));
        break;
      case "priceHigh":
        result.sort((a, b) => (b.salePriceUsd || 0) - (a.salePriceUsd || 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [products, sortBy, priceRange]);

  const filteredRugs = useMemo(() => {
    let result = [...MOCK_RUGS];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.nameEs.toLowerCase().includes(q)
      );
    }
    result = result.filter(
      (r) => r.priceUsd >= priceRange[0] && r.priceUsd <= priceRange[1]
    );
    return result;
  }, [search, priceRange]);

  // Combine all items for unified pagination
  type UnifiedItem =
    | { type: "rug"; data: RugDesign }
    | { type: "product"; data: Product };

  const allItems = useMemo<UnifiedItem[]>(() => {
    const items: UnifiedItem[] = [];
    if (showRugs) {
      filteredRugs.forEach((r) => items.push({ type: "rug", data: r }));
    }
    if (showMaterials) {
      filteredProducts.forEach((p) => items.push({ type: "product", data: p }));
    }
    return items;
  }, [showRugs, showMaterials, filteredRugs, filteredProducts]);

  const totalPages = Math.max(1, Math.ceil(allItems.length / ITEMS_PER_PAGE));
  const paginatedItems = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddToCart = (product: Product) => {
    if (!product.salePriceUsd || product.currentStock <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      category: product.category,
      priceUsd: product.salePriceUsd,
      quantity: 1,
      imageUrl: product.imageUrl,
      maxStock: product.currentStock,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleAddRugToCart = (rug: RugDesign) => {
    if (rug.stock <= 0) return;
    addItem({
      productId: rug.id,
      name: rug.name,
      category: "alfombra" as any,
      priceUsd: rug.priceUsd,
      quantity: 1,
      imageUrl: rug.image,
      maxStock: rug.stock,
    });
    toast.success(`${rug.name} added to cart`);
  };

  // Detect locale from URL
  const isEs =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/es");

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════ HERO HEADER ═══════════════════ */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20"
          >
            <Heart className="h-4 w-4 mr-2 fill-primary" />
            IMPACTO SOCIAL DIRECTO
          </Badge>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            {isEs ? "Equípate para Crear." : "Gear Up to Create."}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {isEs
              ? "Cada compra apoya directamente a artesanos locales y fortalece comunidades creativas en Venezuela."
              : "Every purchase directly supports local artisans and strengthens creative communities in Venezuela."}
          </p>
        </div>
      </section>

      {/* ═══════════════════ MAIN CONTENT: SIDEBAR + GRID ═══════════════════ */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─────── SIDEBAR ─────── */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category checkboxes */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-headline font-semibold text-sm text-foreground uppercase tracking-wide">
                  {isEs ? "Categorías" : "Categories"}
                </h3>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showRugs}
                    onChange={(e) => setShowRugs(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm text-foreground">
                    {t("tabs.rugs")}
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showMaterials}
                    onChange={(e) => setShowMaterials(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm text-foreground">
                    {t("tabs.materials")}
                  </span>
                </label>

                {/* Material subcategories */}
                {showMaterials && (
                  <div className="pl-7 space-y-2 border-l-2 border-border ml-2">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full text-xs h-8">
                        <SlidersHorizontal className="h-3 w-3 mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOP_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat === "all"
                              ? t("filters.all")
                              : CATEGORY_MAP[cat]?.en || cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price range */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-headline font-semibold text-sm text-foreground uppercase tracking-wide">
                  {isEs ? "Rango de Precio" : "Price Range"}
                </h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={500}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatPrice(priceRange[0], currency, exchangeRate)}</span>
                    <span>{formatPrice(priceRange[1], currency, exchangeRate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sort */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-headline font-semibold text-sm text-foreground uppercase tracking-wide">
                  {isEs ? "Ordenar" : "Sort By"}
                </h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder={t("sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("sortOptions.newest")}</SelectItem>
                    <SelectItem value="priceLow">{t("sortOptions.priceLow")}</SelectItem>
                    <SelectItem value="priceHigh">{t("sortOptions.priceHigh")}</SelectItem>
                    <SelectItem value="name">{t("sortOptions.name")}</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Impacto Local info card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-headline font-semibold text-sm text-primary">
                    {isEs ? "Impacto Local" : "Local Impact"}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isEs
                    ? "Cada producto que compras apoya a familias artesanas venezolanas y fomenta el desarrollo de comunidades creativas."
                    : "Every product you buy supports Venezuelan artisan families and fosters the development of creative communities."}
                </p>
                <Button variant="link" className="p-0 h-auto text-xs text-primary" asChild>
                  <Link href="/designer">
                    <Palette className="h-3 w-3 mr-1" />
                    {isEs ? "Diseña tu alfombra" : "Design your rug"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* ─────── PRODUCT GRID ─────── */}
          <main className="flex-1">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {allItems.length}{" "}
                {isEs ? "productos encontrados" : "products found"}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/designer">
                  <Palette className="h-4 w-4 mr-2" />
                  {t("rugs.requestCustom")}
                </Link>
              </Button>
            </div>

            {/* Loading state */}
            {loading && showMaterials && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden rounded-xl">
                    <Skeleton className="aspect-square" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-destructive mb-2">{error}</p>
                <Button variant="outline" onClick={() => setCategory(category)}>
                  {t("retry") || "Retry"}
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && allItems.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t("noResults")}</p>
              </div>
            )}

            {/* Product grid */}
            {!loading && !error && paginatedItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedItems.map((item) => {
                  if (item.type === "rug") {
                    const rug = item.data;
                    return (
                      <Card
                        key={`rug-${rug.id}`}
                        className="group overflow-hidden rounded-xl bg-card hover:shadow-xl transition-all duration-300"
                      >
                        {/* Image area */}
                        <div
                          className={`aspect-square relative overflow-hidden ${
                            rug.image
                              ? "bg-muted"
                              : `bg-gradient-to-br ${rug.gradient}`
                          }`}
                        >
                          {rug.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={rug.image}
                              alt={isEs ? rug.nameEs : rug.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                              <div className="text-center">
                                <Palette className="h-12 w-12 text-white/40 mx-auto mb-2" />
                                <span className="text-white/60 text-sm font-medium">
                                  {rug.size}
                                </span>
                              </div>
                            </div>
                          )}
                          {/* Featured badge */}
                          {rug.featured && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold shadow-lg">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Destacado
                              </Badge>
                            </div>
                          )}
                          {/* Ready to ship badge */}
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-primary/90 text-primary-foreground text-xs">
                              <Truck className="h-3 w-3 mr-1" />
                              {t("rugs.readyToShip")}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-5">
                          {/* Name + Price side by side */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-headline font-semibold text-foreground line-clamp-1">
                              {isEs ? rug.nameEs : rug.name}
                            </h3>
                            <span className="font-bold text-lg text-primary whitespace-nowrap">
                              {formatPrice(rug.priceUsd, currency, exchangeRate)}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {isEs ? rug.descriptionEs : rug.description}
                          </p>

                          {/* Add to cart */}
                          <Button
                            className="w-full"
                            disabled={rug.stock <= 0}
                            onClick={() => handleAddRugToCart(rug)}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            {rug.stock > 0
                              ? isEs
                                ? "Añadir al Carrito"
                                : t("addToCart")
                              : t("outOfStock")}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  }

                  // Material product card
                  const product = item.data;
                  return (
                    <Card
                      key={`product-${product.id}`}
                      className="group overflow-hidden rounded-xl bg-card hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image area */}
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        {product.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-500" />
                        )}
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="text-xs">
                            {CATEGORY_MAP[product.category]?.en ||
                              product.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        {/* Name + Price side by side */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h3 className="font-headline font-semibold text-foreground line-clamp-1">
                              {product.name}
                            </h3>
                            {product.brandName && (
                              <span className="text-xs text-muted-foreground">
                                {product.brandName}
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-lg text-primary whitespace-nowrap">
                            {product.salePriceUsd
                              ? formatPrice(
                                  product.salePriceUsd,
                                  currency,
                                  exchangeRate
                                )
                              : "—"}
                          </span>
                        </div>

                        {/* Description */}
                        {product.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        {!product.description && <div className="mb-4" />}

                        {/* Stock indicator */}
                        <div className="flex items-center justify-end mb-3">
                          <span
                            className={`text-xs ${
                              product.currentStock > 0
                                ? "text-green-500"
                                : "text-destructive"
                            }`}
                          >
                            {product.currentStock > 0
                              ? `${t("inStock")} (${product.currentStock})`
                              : t("outOfStock")}
                          </span>
                        </div>

                        {/* Add to cart */}
                        <Button
                          className="w-full"
                          disabled={
                            !product.salePriceUsd ||
                            product.currentStock <= 0
                          }
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {product.currentStock > 0
                            ? isEs
                              ? "Añadir al Carrito"
                              : t("addToCart")
                            : t("outOfStock")}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ─────── PAGINATION ─────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ═══════════════════ IMPACT CTA BANNER (full-width) ═══════════════════ */}
      <section className="bg-primary text-primary-foreground mt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Heart className="h-10 w-10 mx-auto opacity-80 fill-current" />
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              {isEs
                ? "Tu creatividad teje nuevas oportunidades"
                : "Your creativity weaves new opportunities"}
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
              {isEs
                ? "Cada compra contribuye a nuestra meta mensual de impacto comunitario. Juntos estamos transformando comunidades a través del arte textil."
                : "Each purchase contributes to our monthly community impact goal. Together we are transforming communities through textile art."}
            </p>

            {/* Progress bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between text-sm text-primary-foreground/70">
                <span>{isEs ? "Meta mensual" : "Monthly goal"}</span>
                <span>72%</span>
              </div>
              <div className="w-full h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-foreground/90 rounded-full transition-all duration-1000"
                  style={{ width: "72%" }}
                />
              </div>
              <p className="text-xs text-primary-foreground/60">
                {isEs
                  ? "36 de 50 familias artesanas apoyadas este mes"
                  : "36 of 50 artisan families supported this month"}
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="mt-4"
              asChild
            >
              <Link href="/designer">
                <Palette className="h-5 w-5 mr-2" />
                {isEs ? "Crea tu propio diseño" : "Create your own design"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
