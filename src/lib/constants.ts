import type { DesignComplexity } from "@/types";

// Price per m2 based on number of colors (USD)
export const PRICE_PER_M2: Record<DesignComplexity, number> = {
  "2colors": 120,
  "3colors": 150,
  "4colors": 180,
  "5colors": 200,
};

// Delivery zones
export const DELIVERY_ZONES = {
  zona1: 5,
  zona2: 7,
  zona3: 10,
} as const;

// WhatsApp number for orders
export const WHATSAPP_NUMBER = "+584120993377";

// Max AI designs per cookie session
export const MAX_DESIGNS_PER_SESSION = 2;

// Cookie name for design count
export const DESIGN_COUNT_COOKIE = "alf_designs";

// Category display mappings
export const CATEGORY_MAP: Record<string, { en: string; es: string }> = {
  estambre: { en: "Yarn", es: "Estambre" },
  tijeras: { en: "Scissors", es: "Tijeras" },
  pistola: { en: "Tufting Gun", es: "Pistola de Tufting" },
  pega_vinil: { en: "Vinyl Glue", es: "Pega Vinílica" },
  backing: { en: "Backing Fabric", es: "Tela Backing" },
  tela: { en: "Fabric", es: "Tela" },
  silicon: { en: "Silicone", es: "Silicón" },
  repuestos: { en: "Spare Parts", es: "Repuestos" },
  otro: { en: "Other", es: "Otros" },
};

// E-commerce product categories for filtering
export const SHOP_CATEGORIES = [
  "all",
  "estambre",
  "pistola",
  "tijeras",
  "backing",
  "otro",
] as const;
