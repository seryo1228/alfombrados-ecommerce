import axios from "axios";
import type {
  Product,
  Course,
  ExchangeRate,
  OrderSubmission,
  DesignRequest,
  DesignResponse,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Public endpoints (no auth required)
export const publicApi = {
  // Site config
  getConfig: async () => {
    const { data } = await api.get<Record<string, Record<string, unknown>>>("/public/config");
    return data;
  },

  // Portfolio gallery
  getPortfolio: async (category?: string) => {
    const params = category && category !== "all" ? { category } : {};
    const { data } = await api.get<{
      data: Array<{
        id: string;
        title: string;
        description: string | null;
        category: string;
        imageUrl: string;
        widthCm: string | null;
        heightCm: string | null;
        featured: boolean;
      }>;
      categories: string[];
    }>("/public/portfolio", { params });
    return data;
  },

  // Rugs in stock (alfombras terminadas)
  getRugs: async () => {
    const { data } = await api.get<{
      data: Array<{
        id: string;
        name: string;
        description: string | null;
        widthCm: string;
        heightCm: string;
        salePriceUsd: string;
        imageUrl: string | null;
        season: string | null;
        style: string | null;
        colors: number | null;
      }>;
    }>("/public/rugs");
    return data;
  },

  // Products
  getProducts: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get<{ data: Product[]; total: number }>(
      "/public/products",
      { params }
    );
    return data;
  },

  getProduct: async (id: number) => {
    const { data } = await api.get<Product>(`/public/products/${id}`);
    return data;
  },

  // Courses
  getCourses: async () => {
    const { data } = await api.get<{ data: Course[] }>("/public/courses");
    return data;
  },

  getCourse: async (id: number) => {
    const { data } = await api.get<Course>(`/public/courses/${id}`);
    return data;
  },

  // Exchange rate
  getExchangeRate: async () => {
    const { data } = await api.get<ExchangeRate>(
      "/public/exchange-rate"
    );
    return data;
  },

  // Orders
  submitOrder: async (order: OrderSubmission) => {
    const { data } = await api.post("/public/orders", order);
    return data;
  },

  // Course enrollment
  enrollCourse: async (
    courseId: string | number,
    enrollment: {
      participantName: string;
      phone: string;
      email: string;
      paymentMethod: string;
    }
  ) => {
    const { data } = await api.post(
      `/public/courses/${courseId}/enroll`,
      enrollment
    );
    return data;
  },
};

// AI Design endpoint (proxied through our Next.js API)
export const designApi = {
  generate: async (request: DesignRequest): Promise<DesignResponse> => {
    const { data } = await axios.post<DesignResponse>(
      "/api/design",
      request
    );
    return data;
  },
};

export default api;
