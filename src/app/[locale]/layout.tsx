import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={cn("font-sans", inter.variable)}>
      <body className="antialiased min-h-screen flex flex-col">
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
