import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.alfombra2.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alfombra2 | Alfombras Tufting Artesanales con Propósito Social",
    template: "%s | Alfombra2",
  },
  description:
    "Alfombras tufting artesanales hechas a mano en Venezuela. Diseños personalizados, materiales premium, cursos de tufting y un diseñador con IA. Cada alfombra cuenta una historia.",
  keywords: [
    "alfombras tufting",
    "alfombras artesanales",
    "alfombras personalizadas",
    "tufting Venezuela",
    "alfombra custom",
    "rug tufting",
    "custom tufted rugs",
    "tufting supplies",
    "estambre para tufting",
    "pistola de tufting",
    "cursos de tufting",
    "diseño de alfombras con IA",
    "alfombra2",
    "proyecto social Venezuela",
  ],
  authors: [{ name: "Alfombra2", url: SITE_URL }],
  creator: "Alfombra2",
  publisher: "Alfombra2",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "Alfombra2",
    title: "Alfombra2 | Alfombras Tufting Artesanales",
    description:
      "Creamos alfombras artesanales únicas mientras generamos oportunidades para nuestra comunidad. Diseña tu alfombra con IA.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alfombra2 - Alfombras Tufting Artesanales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alfombra2 | Alfombras Tufting Artesanales",
    description:
      "Creamos alfombras artesanales únicas mientras generamos oportunidades para nuestra comunidad.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/icon-192.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
