// Mirrors ERP types for public e-commerce use

export type ItemCategory =
  | "estambre"
  | "tijeras"
  | "pistola"
  | "pega_vinil"
  | "backing"
  | "tela"
  | "silicon"
  | "repuestos"
  | "otro";

export type Currency = "USD" | "VES";

export type PaymentMethod =
  | "binance"
  | "pago_movil"
  | "paypal"
  | "zelle"
  | "efectivo";

export type ContactChannel =
  | "whatsapp"
  | "instagram"
  | "referido"
  | "website"
  | "otro";

export type DesignComplexity = "simple" | "moderate" | "complex" | "premium";

export type CourseFormat = "online" | "in_person" | "hybrid";

// Product from ERP inventory
export interface Product {
  id: number;
  name: string;
  category: ItemCategory;
  baseUnit: string;
  currentStock: number;
  minStock: number;
  salePriceUsd: number | null;
  costingMethod: "fifo" | "promedio";
  brandId: number | null;
  brandName: string | null;
  imageUrl: string | null;
  description: string | null;
  alertStatus: "ok" | "low" | "critical";
}

// Course from ERP
export interface Course {
  id: number;
  name: string;
  description: string | null;
  priceUsd: number;
  durationHours: number;
  format: CourseFormat;
  startDate: string | null;
  endDate: string | null;
  maxParticipants: number | null;
  enrollmentCount: number;
  imageUrl: string | null;
}

// Cart item
export interface CartItem {
  productId: number;
  name: string;
  category: ItemCategory;
  priceUsd: number;
  quantity: number;
  imageUrl: string | null;
  maxStock: number;
}

// Rug quote request
export interface RugQuote {
  widthCm: number;
  heightCm: number;
  areaM2: number;
  designComplexity: DesignComplexity;
  pricePerM2Usd: number;
  totalUsd: number;
  designImageUrl?: string;
  customerNotes?: string;
}

// Customer for checkout
export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  contactChannel: ContactChannel;
}

// Shipping address
export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Order submission
export interface OrderSubmission {
  customer: CheckoutCustomer;
  shipping: ShippingAddress;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  rugQuote?: RugQuote;
  paymentMethod: "online" | "whatsapp";
  currency: Currency;
  notes?: string;
}

// AI Design request
export interface DesignRequest {
  imageBase64?: string;
  prompt?: string;
}

export interface DesignResponse {
  imageUrl: string;
  prompt: string;
}

// Exchange rate
export interface ExchangeRate {
  id: number;
  rateVesPerUsd: number;
  effectiveDate: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}
