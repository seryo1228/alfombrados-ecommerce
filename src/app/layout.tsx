import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alfombrados | Custom Tufted Rugs & Tufting Supplies",
    template: "%s | Alfombrados",
  },
  description:
    "Custom tufted rugs, premium tufting materials, and expert courses. Design your rug with AI, shop supplies, and learn the art of tufting.",
  keywords: [
    "tufting",
    "custom rugs",
    "tufted rugs",
    "tufting supplies",
    "yarn",
    "tufting gun",
    "tufting courses",
    "alfombras",
    "rug design",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
