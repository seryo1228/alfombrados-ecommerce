import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/analytics";
import { MaintenanceGate } from "@/components/maintenance-gate";
import { ProgressBar } from "@/components/progress-bar";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-headline" });

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
    <html lang={locale} className={cn("font-sans", jakarta.variable, manrope.variable)}>
      <body className="antialiased min-h-screen flex flex-col">
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <MaintenanceGate>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </MaintenanceGate>
          <ProgressBar />
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
