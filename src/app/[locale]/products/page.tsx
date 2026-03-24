"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Package,
  Palette,
  Truck,
  Sparkles,
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
import { SHOP_CATEGORIES, CATEGORY_MAP } from "@/lib/constants";
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
}

const MOCK_RUGS: RugDesign[] = [
  {
    id: 101, name: "Floral Rose Garden", nameEs: "Jardín de Rosas Floral",
    description: "Handcrafted floral design with rose motifs in soft pink tones",
    descriptionEs: "Diseño floral artesanal con motivos de rosas en tonos rosa suave",
    size: "100×80 cm", priceUsd: 120, image: null,
    gradient: "from-rose-400 via-pink-300 to-rose-200", stock: 1,
  },
  {
    id: 102, name: "Ocean Waves Abstract", nameEs: "Olas del Mar Abstracto",
    description: "Abstract wave pattern inspired by the Caribbean sea",
    descriptionEs: "Patrón abstracto de olas inspirado en el mar Caribe",
    size: "120×80 cm", priceUsd: 150, image: null,
    gradient: "from-sky-400 via-blue-300 to-cyan-200", stock: 1,
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

/* ──────────────────────────────────────────────────────────────────
   Materials & tools — existing product catalog
   ────────────────────────────────────────────────────────────────── */
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1, name: "Acrylic Yarn - Premium White", category: "estambre",
    baseUnit: "gramos", currentStock: 5000, minStock: 500,
    salePriceUsd: 12.99, costingMethod: "fifo",
    brandId: 1, brandName: "YarnPro", imageUrl: null,
    description: "High-quality acrylic yarn, perfect for tufting. 500g spool.",
    alertStatus: "ok",
  },
  {
    id: 2, name: "Tufting Gun - Cut Pile", category: "pistola",
    baseUnit: "unidades", currentStock: 15, minStock: 3,
    salePriceUsd: 189.99, costingMethod: "fifo",
    brandId: 2, brandName: "TuftMaster", imageUrl: null,
    description: "Professional cut pile tufting gun. Adjustable speed and pile height.",
    alertStatus: "ok",
  },
  {
    id: 3, name: "Primary Tufting Cloth", category: "backing",
    baseUnit: "m2", currentStock: 200, minStock: 20,
    salePriceUsd: 8.5, costingMethod: "fifo",
    brandId: null, brandName: null, imageUrl: null,
    description: "High-quality primary tufting cloth. 1m width, sold per m2.",
    alertStatus: "ok",
  },
  {
    id: 4, name: "Tufting Scissors - Precision", category: "tijeras",
    baseUnit: "unidades", currentStock: 45, minStock: 10,
    salePriceUsd: 24.99, costingMethod: "fifo",
    brandId: null, brandName: null, imageUrl: null,
    description: "Precision scissors for carpet trimming and detailing.",
    alertStatus: "ok",
  },
  {
    id: 5, name: "Acrylic Yarn - Electric Blue", category: "estambre",
    baseUnit: "gramos", currentStock: 3000, minStock: 500,
    salePriceUsd: 12.99, costingMethod: "fifo",
    brandId: 1, brandName: "YarnPro", imageUrl: null,
    description: "Vibrant electric blue acrylic yarn. 500g spool.",
    alertStatus: "ok",
  },
  {
    id: 6, name: "Vinyl Glue - 1 Gallon", category: "pega_vinil",
    baseUnit: "litros", currentStock: 30, minStock: 5,
    salePriceUsd: 34.99, costingMethod: "fifo",
    brandId: null, brandName: null, imageUrl: null,
    description: "Industrial-grade vinyl glue for rug backing. 1 gallon.",
    alertStatus: "ok",
  },
];

/* ══════════════════════════════════════════════════════════════════ */

export default function ProductsPage() {
  const t = useTranslations("products");
  const [activeTab, setActiveTab] = useState<"rugs" | "materials">("rugs");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const addItem = useCartStore((s) => s.addItem);
  const { currency, exchangeRate } = useCurrencyStore();

  const filteredProducts = useMemo(() => {
    let products = MOCK_PRODUCTS;
    if (search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== "all") {
      products = products.filter((p) => p.category === category);
    }
    switch (sortBy) {
      case "priceLow":
        products = [...products].sort((a, b) => (a.salePriceUsd || 0) - (b.salePriceUsd || 0));
        break;
      case "priceHigh":
        products = [...products].sort((a, b) => (b.salePriceUsd || 0) - (a.salePriceUsd || 0));
        break;
      case "name":
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return products;
  }, [search, category, sortBy]);

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
      category: "alfombra",
      priceUsd: rug.priceUsd,
      quantity: 1,
      imageUrl: rug.image,
      maxStock: rug.stock,
    });
    toast.success(`${rug.name} added to cart`);
  };

  // Detect locale from URL
  const isEs = typeof window !== "undefined" && window.location.pathname.startsWith("/es");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab("rugs")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "rugs"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {t("tabs.rugs")}
        </button>
        <button
          onClick={() => setActiveTab("materials")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "materials"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          {t("tabs.materials")}
        </button>
      </div>

      {/* ═══════════════════ RUGS TAB ═══════════════════ */}
      {activeTab === "rugs" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{t("rugs.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("rugs.subtitle")}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/designer">
                <Palette className="h-4 w-4 mr-2" />
                {t("rugs.requestCustom")}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_RUGS.map((rug) => (
              <Card
                key={rug.id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image / placeholder */}
                <div className={`aspect-[4/3] relative overflow-hidden ${rug.image ? "bg-muted" : `bg-gradient-to-br ${rug.gradient}`}`}>
                  {rug.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={rug.image}
                      alt={isEs ? rug.nameEs : rug.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Palette className="h-10 w-10 text-white/40 mx-auto mb-2" />
                        <span className="text-white/50 text-sm font-medium">
                          {isEs ? rug.nameEs : rug.name}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs">
                      <Truck className="h-3 w-3 mr-1" />
                      {t("rugs.readyToShip")}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                      {rug.size}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {t("rugs.oneOfAKind")}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1">
                    {isEs ? rug.nameEs : rug.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {isEs ? rug.descriptionEs : rug.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xl text-primary">
                      {formatPrice(rug.priceUsd, currency, exchangeRate)}
                    </span>
                    <span className={`text-xs ${rug.stock > 0 ? "text-green-500" : "text-destructive"}`}>
                      {rug.stock > 0 ? t("inStock") : t("outOfStock")}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    disabled={rug.stock <= 0}
                    onClick={() => handleAddRugToCart(rug)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t("addToCart")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════ MATERIALS TAB ═══════════════════ */}
      {activeTab === "materials" && (
        <div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHOP_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? t("filters.all") : CATEGORY_MAP[cat]?.en || cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("sortOptions.newest")}</SelectItem>
                <SelectItem value="priceLow">{t("sortOptions.priceLow")}</SelectItem>
                <SelectItem value="priceHigh">{t("sortOptions.priceHigh")}</SelectItem>
                <SelectItem value="name">{t("sortOptions.name")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {CATEGORY_MAP[product.category]?.en || product.category}
                      </Badge>
                      {product.brandName && (
                        <span className="text-xs text-muted-foreground">
                          {product.brandName}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-lg text-primary">
                        {product.salePriceUsd
                          ? formatPrice(product.salePriceUsd, currency, exchangeRate)
                          : "—"}
                      </span>
                      <span
                        className={`text-xs ${
                          product.currentStock > 0 ? "text-green-500" : "text-destructive"
                        }`}
                      >
                        {product.currentStock > 0
                          ? `${t("inStock")} (${product.currentStock})`
                          : t("outOfStock")}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      size="sm"
                      disabled={!product.salePriceUsd || product.currentStock <= 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.currentStock > 0 ? t("addToCart") : t("outOfStock")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
